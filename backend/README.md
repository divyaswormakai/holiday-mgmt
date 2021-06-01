# CV/resume API
# Resume is divided into 5 sections based on that CRUD operations functions.

# 1. Summary endpoint- gives the summary of Resume. /api/content/summary
# get summary endpoint [Get Method]= uri:port/api/content/summary
# Create new Summary endpoint [POST method] = uri:port/api/content/summary/new 
header: content-type = application/json
body data: 
{name(required), title(required), summary(required), address(required), email(required), phone(required), social:{linkedIn, facebook, github} 

# Update Summary endpoint [Update method] = uri:port/api/content/summary/update/:id 
Data needs to send same as POST method, with ID of the summary row.

# Delete Summary
# EndPoint [Delete] = uri:port/api/content/summary/:id




# 2. Education endpoint- gives the education qualification lists of Resume. /api/content/education
# get summary endpoint [Get Method]= uri:port/api/content/education
# Create new education endpoint [POST method] = uri:port/api/content/education/new 
header: content-type = application/json
body data: 
{degree(required), college(required), address(required), date:{from(string), to(string)}, courses:[{"name of each courses"}]


# Update Summary endpoint [Update method] = uri:port/api/content/education/update/:id 
Data needs to send same as POST method, with ID of the education row.

# Delete Summary
# EndPoint [Delete] = uri:port/api/content/education/:id



# 3. WorkExperience endpoint- gives the work experience lists of Resume. /api/content/work-experience
# get work-experience endpoint [Get Method]= uri:port/api/content/work-experience
# Create new work experience endpoint [POST method] = uri:port/api/content/work-experience/new 
header: content-type = application/json
body data: 
{title(required), company(required), address(required), date:{from(string), to(string)}, responsibilities:[{"each responsibilities"}]


# Update workExperience endpoint [Update method] = uri:port/api/content/work-experience/update/:id 
Data needs to send same as POST method, with ID of the work-experience row.

# Delete workExperience
# EndPoint [Delete] = uri:port/api/content/work-experience/:id

# 4. Skill endpoint- gives the work experience lists of Resume. /api/content/skills
# get skills endpoint [Get Method]= uri:port/api/content/skills
# Create new work experience endpoint [POST method] = uri:port/api/content/skills/new 
header: content-type = application/json
body data: 
{type(required), title(required), skills:[{"each skills"}]


# Update Skill endpoint [Update method] = uri:port/api/content/skills/update/:id 
Data needs to send same as POST method, with ID of the skill row.

# Delete Skill
# EndPoint [Delete] = uri:port/api/content/skills/:id



# 5. OtherField endpoint- gives the work experience lists of Resume. /api/content/other-fields
# get other-fields endpoint [Get Method]= uri:port/api/content/other-fields
# Create new work experience endpoint [POST method] = uri:port/api/content/other-fields/new 
header: content-type = application/json
body data: 
{type(required), name(required), details:[{"certifications details, voluntering or interests"}]


# Update other-fields endpoint [Update method] = uri:port/api/content/other-fields/update/:id 
Data needs to send same as POST method, with ID of the other-fields row.

# Delete Skill
# EndPoint [Delete] = uri:port/api/content/other-fields/:id



