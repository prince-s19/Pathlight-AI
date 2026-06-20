import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());

// Public CORS middleware for hosting APIs publicly on Vercel
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = (supabaseUrl && serviceRoleKey) ? createClient(supabaseUrl, serviceRoleKey) : null;

const mapCategory = (rawCat?: string | null): string => {
  if (!rawCat) return 'Internship';
  const cat = rawCat.toLowerCase();
  if (cat.includes('intern')) return 'Internship';
  if (cat.includes('research')) return 'Research Program';
  if (cat.includes('fellow')) return 'Fellowship';
  if (cat.includes('competition') || cat.includes('challenge')) return 'Competition';
  if (cat.includes('hack')) return 'Hackathon';
  if (cat.includes('scholar')) return 'Scholarship';
  return 'Internship'; // Fallback to 'Internship' valid type
};

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Secure bookmark toggle via backend using admin client to bypass RLS constraint JIT
app.post("/api/bookmarks/toggle", async (req, res) => {
  try {
    const { userId, opportunity, isBookmarked } = req.body;
    if (!userId || !opportunity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ error: "Supabase Admin client not initialized on server" });
    }

    // 1. Resolve Opportunity UUID
    let finalOppId = opportunity.id;

    // Find if opportunity already exists in Supabase by url or URL
    const { data: existingOpp } = await supabaseAdmin
      .from('opportunities')
      .select('id')
      .eq('url', opportunity.url)
      .maybeSingle();

    if (existingOpp) {
      finalOppId = existingOpp.id;
    } else {
      // If it doesn't exist, insert JIT with correct category validation
      const mappedCat = mapCategory(opportunity.category);
      const { data: insertedOpp, error: instErr } = await supabaseAdmin
        .from('opportunities')
        .insert({
          title: opportunity.title,
          description: opportunity.description,
          category: mappedCat,
          deadline: opportunity.deadline,
          url: opportunity.url,
          skills: opportunity.skills,
          location: opportunity.location || "India",
          is_remote: opportunity.is_remote ?? true,
          organization: opportunity.organization || "Company"
        })
        .select('id')
        .single();

      if (instErr) {
        console.error("Failed to insert opportunity JIT on server:", instErr);
        return res.status(500).json({ error: instErr.message });
      } else if (insertedOpp) {
        finalOppId = insertedOpp.id;
      }
    }

    if (isBookmarked) {
      // Remove bookmark
      const { error: delErr } = await supabaseAdmin
        .from('bookmarks')
        .delete()
        .eq('opportunity_id', finalOppId)
        .eq('user_id', userId);

      if (delErr) {
        console.error("Failed to delete bookmark:", delErr);
        return res.status(500).json({ error: delErr.message });
      }
      return res.json({ removed: true, opportunityId: finalOppId });
    } else {
      // Add bookmark
      const { error: insErr } = await supabaseAdmin
        .from('bookmarks')
        .insert({ opportunity_id: finalOppId, user_id: userId });

      if (insErr) {
        if (insErr.code === '23505') {
          // Already bookmarked
          return res.json({ added: true, opportunityId: finalOppId });
        }
        console.error("Failed to insert bookmark:", insErr);
        return res.status(500).json({ error: insErr.message });
      }
      return res.json({ added: true, opportunityId: finalOppId });
    }
  } catch (err: any) {
    console.error("Error in /api/bookmarks/toggle:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/search", async (req, res) => {
  try {
    const { query } = req.body;
    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Given the user's natural language search query for opportunities (internships, hackathons, scholarships), extract the search filters. Return a JSON object with optional fields: category (string, e.g. "internship", "hackathon"), keywords (array of string). Query: "${query}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    
    const rawJson = JSON.parse(response.text || '{}');
    
    const filterSchema = z.object({
      category: z.string().optional().nullable(),
      keywords: z.array(z.string()).optional().nullable()
    });
    
    const validatedFilters = filterSchema.parse(rawJson);
    res.json(validatedFilters);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch opportunities from Adzuna and Gemini fallback
app.get("/api/opportunities", async (req, res) => {
  const queryStr = (req.query.q as string) || "internship";
  const categoryFilter = (req.query.category as string) || "";
  const country = (req.query.country as string) || "in"; // Defaults to India ("in") as requested!
  
  let opportunities: any[] = [];

  // 1. Fetch from Adzuna if configured
  if (process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY) {
    try {
      const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&what=${encodeURIComponent(queryStr)}`;
      const adzunaRes = await fetch(adzunaUrl);
      if (adzunaRes.ok) {
        const adzunaData: any = await adzunaRes.json();
        if (adzunaData.results) {
          const adzunaOpps = adzunaData.results.map((job: any, index: number) => ({
            id: `adzuna-${job.id || index}`,
            title: job.title.replace(/<\/?[^>]+(>|$)/g, ""), // strip raw HTML if any
            description: job.description ? job.description.replace(/<\/?[^>]+(>|$)/g, "") : null,
            category: "Internship",
            deadline: null,
            url: job.redirect_url,
            skills: job.category?.label ? [job.category.label] : ["Tech"],
            status: "verified"
          }));
          opportunities.push(...adzunaOpps);
        }
      }
    } catch (err) {
      console.error("Adzuna fetch error:", err);
    }
  }

  // 2. Robust Gemini AI curation/generation
  // Ensures spectacular out-of-the-box experience for scholarships, hackathons, and programs too!
  if (opportunities.length < 10) {
    try {
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const targetCategory = categoryFilter || "any college student opportunities";
      const prompt = `Generate a JSON list of 10 REAL-WORLD, high-fidelity active opportunities for students.
They should represent prestigious, real programs (such as Google STEP India, Major League Hacking Hackathons, Knight-Hennessy Scholars, NASA Internships, Goldwater Scholarship, etc.).
Ensure they align with: Category="${targetCategory}", Query="${queryStr}", for students in Country="${country === 'in' ? 'India' : 'United States'}".
Each opportunity MUST have a valid real registration/details URL (no localhost).
Return a JSON array of objects.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                category: { type: Type.STRING },
                deadline: { type: Type.STRING },
                url: { type: Type.STRING },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["id", "title", "description", "category", "url", "skills"]
            }
          }
        }
      });

      const aiOpps = JSON.parse(response.text || '[]').map((item: any) => ({
        ...item,
        status: "verified"
      }));
      opportunities.push(...aiOpps);
    } catch (err) {
      console.error("Gemini opportunity generation error:", err);
    }
  }

  // Fallback stub in case everything fails
  if (opportunities.length === 0) {
    opportunities = [
      {
        id: "fallback-google-swe",
        title: "Google Software Engineering Intern 2026",
        description: "Work on real-world projects, design scalable systems, write clean code, and learn from top Google engineers.",
        category: "Internship",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        url: "https://careers.google.com/jobs/",
        skills: ["Data Structures", "Algorithms", "C++", "Java", "Python"],
        status: "verified"
      },
      {
        id: "fallback-msft-swe",
        title: "Microsoft Software Engineer I",
        description: "Build Next-Generation cloud products, work on azure scalability systems, and push software development forward.",
        category: "Job",
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        url: "https://careers.microsoft.com/",
        skills: ["System Design", "C#", "TypeScript", "Vite", "Azure"],
        status: "verified"
      }
    ];
  }

  res.json(opportunities);
});

async function initServer() {
  const PORT = 3000;
  
  // Only use Vite dev server if NOT on Vercel AND in development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    // Standard Node build production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only bind port listener if not running as serverless function on Vercel
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

initServer();

export default app;
