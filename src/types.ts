export type Profile = {
  user_id: string;
  name: string | null;
  skills: string[] | null;
  interests: string[] | null;
  education_year: number | null;
  created_at: string;
};

export type Source = {
  id: string;
  name: string;
  base_url: string;
  scrape_config: any;
  is_active: boolean;
};

export type Opportunity = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  deadline: string | null;
  url: string;
  url_hash: string | null;
  skills: string[] | null;
  source_id: string | null;
  status: 'pending_review' | 'verified' | 'rejected';
  created_at: string;
};

export type Bookmark = {
  id: string;
  user_id: string;
  opportunity_id: string;
};
