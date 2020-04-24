from django.urls import path, include
from rest_framework import routers

from api.views import RatingViewSet, MedicineViewSet, UserViewSet

router = routers.DefaultRouter()
router.register('medicines', MedicineViewSet)
router.register('ratings', RatingViewSet)
router.register('users', UserViewSet)
urlpatterns = [
    path('', include(router.urls)),

]
