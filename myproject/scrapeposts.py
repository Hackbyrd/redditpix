import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
from myproject.models import Post
from myproject.models import Comment

import urllib
import httplib
import lxml
from lxml import html
import time, datetime
import json
import re


host = 'www.reddit.com'
headers = {"User-agent" : "NothingLeftToLose"}
retries = 3
rank = 1

def scrape_posts(pagelimit=-1):
     dt = datetime.datetime.now()
     after = None
     pagenum = 1
     rank = 1
     while pagenum != pagelimit:
         url = 'http://www.reddit.com/.json'
         if after:
             url += '?after=%s' % after
         print 'Scraping url: %s\n' % (url)
         
         conn = httplib.HTTPConnection(host)
         conn.request('GET', url, headers=headers)
         resp = conn.getresponse()
         data = resp.read()
         conn.close()

         after = _parsepage(data, dt)
         pagenum+=1
         if not after:
             print "scrape completed"
             return r


def _parsepage(data, dt):
    page = json.loads(data)
    if not page['kind'] == 'Listing':
        return None
    
    after = page['data']['after']
    global rank
    for child in page['data']['children']:
        if child['kind'] == 't3':
            sub = child['data']
            writesubmission(sub, rank, dt)
            rank+=1
             
    print '    writing %d submissions to database...' % (len(page['data']['children']))
    return after

IMAGE_DOMAINS = ['i.imgur.com', 'imgur.com']

def writesubmission(sub, rank, dt):
     date_found = dt
     is_img = False
     if sub['domain'] in IMAGE_DOMAINS:
          is_img = True
     permalink = sub['permalink']
     upVotes = sub['ups']
     downVotes = sub['downs']
     score = sub['score']
     num_comments = sub['num_comments']
     hot_rank = rank
     link = mod_link(sub['domain'], sub['url'])
     over_18 = sub['over_18']
     selftext = sub['selftext']
     is_self = sub['is_self']
     if not link:
          link = sub['url']
          is_img = False
     try:
          post = Post.objects.get(permalink=permalink)
          post.upVotes= upVotes
          post.downVotes = downVotes
          post.score=score
          post.num_comments=num_comments
          post.rank = hot_rank
          post.date_found = date_found
          post.over_18 = over_18
          post.link = link
          post.save()
     except:
          post = Post(rank=hot_rank,
                      date_found = date_found,
                      domain=sub['domain'],
                      name = sub['name'],
                      title = sub['title'],
                      link = link,
                      subreddit = sub['subreddit'],
                      subreddit_id = sub['subreddit_id'],
                      upVotes=upVotes,
                      downVotes = downVotes,
                      score = sub['score'],
                      author = sub['author'],
                      permalink = sub['permalink'],
                      num_comments = sub['num_comments'],
                      is_img = is_img,
                      over_18 = over_18,
                      selftext = selftext,
                      is_self = is_self
                      )
          post.save()


# Modifies the link to get an image if it can
def mod_link(domain, url):
     if domain == 'imgur.com':
          return scrape_imgur(url)
     else:
          return url

# Scrapes i.imgur link from imgur
def scrape_imgur(url):
     conn = httplib.HTTPConnection('imgur.com')
     conn.request('GET', url)
     resp = conn.getresponse()
     data = resp.read()
     conn.close()
     
     try:
          m = re.search('rel="image_src" href="\w*.*"', data)
          parse_string = m.group()
          start_ind = parse_string.find("href=") + 6
          end_ind = len(parse_string) - 1
          url = parse_string[start_ind:end_ind]
          if not ".jpg" in url:
               url += '.jpg'
          return url
     except:
          return None

if __name__ == '__main__':
     os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
     scrape_posts(10)
