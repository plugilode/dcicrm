-- Insert company data into the companies table

INSERT INTO companies (
    name, logo_url, city, foundation_date, domain, employee_range, categories, industry, address, contact_email, revenue, active,
    catchall_email_domain, cleaned_phone_number, additional_industries, alexa_rank, angel_list_profile_url, blog_url, business_industries,
    country_name, crunchbase_url, employee_estimate, facebook_profile_url, full_address, linkedin_id, linkedin_profile_url, main_domain,
    main_phone_cleaned_number, main_phone_number, main_phone_source, search_keywords, spoken_languages, state_name, stock_exchange,
    stock_symbol, store_count, twitter_profile_url, website_url, year_founded, zip_code
) VALUES (
    'Building Radar', 'https://zenprospect-production.s3.amazonaws.com/uploads/pictures/67cebf0eda64cd00018f534a/picture', 'Munich', 2015, 'buildingradar.com', '51-200', ARRAY['internet', 'computer software'], 'information technology & services', '63 Erika-Mann-Strasse', 'h.rusche@buildingradar.com', 96000000, true, 'Google',
    'false', '+4989414172160', ARRAY['internet', 'computer software'], 10446, 'http://angel.co/building-radar', '', ARRAY['information technology & services', 'internet', 'computer software'], 'Germany', '', 96, 'https://www.facebook.com/buildingradar', 'erika-mann-str. 63, münchen, bayern 80636, de', '5042814', 'http://www.linkedin.com/company/buildingradar', 'buildingradar.com',
    '+4989414172160', '+49 89 414172160', 'Owler', ARRAY['construction industry', 'construction projects globally', 'artificial intelligence', 'revenue engineering', 'sales enablement', 'construction leads', 'sales process', 'sales execution', 'commercial excellence', 'saas', 'construction', 'lead generation', 'enterprise software', 'advertising', 'software', 'consumer internet', 'information technology', 'internet', 'it services & it consulting', 'information technology & services', 'computer software', 'marketing & advertising', 'sales', 'enterprises', 'b2b', 'consumers'], ARRAY['English', 'German', 'Spanish', 'Chinese'], 'Bavaria', '', '', 0, 'https://twitter.com/buildingradar', 'http://www.buildingradar.com', 2015, '80636'
);

INSERT INTO companies (
    name, logo_url, city, foundation_date, domain, employee_range, categories, industry, address, contact_email, revenue, active,
    catchall_email_domain, cleaned_phone_number, additional_industries, alexa_rank, angel_list_profile_url, blog_url, business_industries,
    country_name, crunchbase_url, employee_estimate, facebook_profile_url, full_address, linkedin_id, linkedin_profile_url, main_domain,
    main_phone_cleaned_number, main_phone_number, main_phone_source, search_keywords, spoken_languages, state_name, stock_exchange,
    stock_symbol, store_count, twitter_profile_url, website_url, year_founded, zip_code
) VALUES (
    'Deutsche Telekom', 'https://zenprospect-production.s3.amazonaws.com/uploads/pictures/67bf18cb46d44b00011ec59f/picture', 'Bonn', 1995, 'telekom.com', '10001+', ARRAY['telecommunications', 'information technology & services', 'internet'], 'telecommunications', '140 Friedrich-Ebert-Allee', 'info@telekom.com', 75000000000, true, 'Google',
    'false', '+4922818190', ARRAY['telecommunications', 'information technology & services', 'internet'], 205000, 'http://angel.co/deutsche-telekom', '', ARRAY['telecommunications', 'information technology & services', 'internet'], 'Germany', '', 205000, 'https://facebook.com/deutschetelekom', 'friedrich-ebert-allee 140, bonn, germany 53113, de', '1593', 'http://www.linkedin.com/company/telekom', 'telekom.com',
    '+4922818190', '+49 228 18190', 'Owler', ARRAY['artificial intelligence', 'it security', 'cloud computing', 'internet of things', '5g', 'telecommunications', 'smart home', 'connected car', 'automotive', 'health', 'fiber optics', 'sustainability', 'digitalization', 'mobile', 'internet', 'telecommunications', 'television', 'information technology', 'media', '5g networks', 'mobile services', 'data privacy', 'cybersecurity', 'blockchain technology', 'artificial intelligence', 'digital transformation', 'sustainability', 'corporate governance', 'human resources', 'diversity initiatives', 'risk management', 'financial strategy', 'investor relations', 'consumer services', 'network expansion', 'corporate responsibility', 'social commitment', 'public policy', 'digital identity', 'supply chain management', 'digital society', 'smart business solutions', 'financial services', 'stakeholder engagement', 'carbon neutrality', 'innovation'], ARRAY['German', 'English'], 'North Rhine-Westphalia', '', '', 0, 'https://twitter.com/deutschetelekom', 'http://www.telekom.com', 1995, '53113'
);
