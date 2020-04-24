from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class Medicine(models.Model):
    name = models.CharField(max_length=32)
    description = models.TextField(max_length=360)
    type = models.CharField(max_length=20, blank=False)

    def no_of_ratings(self):
        ratings = Rating.objects.filter(medicine=self)
        return len(ratings)

    def avg_rating(self):
        sum1 = 0
        ratings = Rating.objects.filter(medicine=self)
        for rating in ratings:
            sum1 += rating.stars

        if len(ratings) > 0:
            return sum1/len(ratings)
        else:
            return 0


class Rating(models.Model):
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stars = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    class Meta:
        unique_together = (('user', 'medicine'),)
        index_together = (('user', 'medicine'),)




