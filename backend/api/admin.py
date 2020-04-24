from django.contrib import admin

# Register your models here.
from api.models import Medicine, Rating

admin.site.register(Medicine)
admin.site.register(Rating)
