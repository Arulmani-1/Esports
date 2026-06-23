import os
import re

directory = r"c:\Users\Admin\OneDrive\Desktop\demo esports"
html_files = [f for f in os.listdir(directory) if f.endswith('.html')]

new_sidebar_ul = """    <ul>
      <li><a href="index.html">Home</a></li>
      <li>
        <a href="index.html">Pages <i class="fas fa-chevron-down"></i></a>
        <ul class="mobile-dropdown">
          <li><a href="about.html">About Us</a></li>
          <li><a href="about_me.html">About Me</a></li>
          <li><a href="matches.html">Single Match</a></li>
          <li><a href="contact.html">Contact Us</a></li>
          <li><a href="coming_soon.html">Coming Soon</a></li>
          <li><a href="404.html">404 Error Page</a></li>
        </ul>
      </li>
      <li>
        <a href="index.html">Forum <i class="fas fa-chevron-down"></i></a>
        <ul class="mobile-dropdown">
          <li><a href="all_forum.html">All Forum</a></li>
          <li><a href="single_forum.html">Single Forum</a></li>
          <li><a href="topic.html">Topic</a></li>
        </ul>
      </li>
      <li><a href="portfolio.html">Portfolio</a></li>
      <li><a href="blog.html">Blog</a></li>
      <li>
        <a href="index.html">Shop <i class="fas fa-chevron-down"></i></a>
        <ul class="mobile-dropdown">
          <li><a href="shop.html">Products</a></li>
        </ul>
      </li>
      <li><a href="login.html"><i class="fas fa-user"></i> Login</a></li>
    </ul>"""

# The existing pattern could be slightly different in indentation. We'll find the <ul> inside <aside class="mobile-sidebar">.
for filename in html_files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the mobile sidebar block
    match = re.search(r'<aside class="mobile-sidebar">.*?<ul>(.*?)</ul>.*?</aside>', content, re.DOTALL)
    if match:
        old_ul = "<ul>" + match.group(1) + "</ul>"
        # We need to make sure we don't accidentally replace something else, so we replace exactly this old_ul.
        new_content = content.replace(old_ul, new_sidebar_ul)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filename}")
    else:
        print(f"Skipped {filename} (no match found)")
