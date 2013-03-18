'''
This file shows all the information contained in our database
'''

from django.db import models

class Post(models.Model):
    selftext = models.CharField(max_length=50000)
    over_18  = models.BooleanField()
    is_self = models.BooleanField()

    rank = models.IntegerField()
    date_found = models.DateTimeField()
    domain = models.URLField()
    name = models.CharField(max_length=500)
    title = models.CharField(max_length=500)
    link = models.URLField()
    subreddit = models.CharField(max_length=500)
    subreddit_id = models.CharField(max_length=500)
    upVotes = models.IntegerField()
    downVotes = models.IntegerField()
    score = models.IntegerField()
    author = models.CharField(max_length=500)
    permalink = models.CharField(max_length=500)
    num_comments = models.IntegerField()
    is_img = models.BooleanField()
    def __unicode__(self):
        return self.title
    class Meta:
        ordering = ['-date_found', 'rank']
#        app_label = 'my_project'

class Comment(models.Model):
    post = models.ForeignKey(Post)
    text = models.TextField()
    upVotes = models.IntegerField()
    downVotes = models.IntegerField()
    def __unicode__(self):
        return self.text
