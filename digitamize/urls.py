from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView, RedirectView

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='index.html'), name="home"),

    url(r'^auth/', include('rest_auth.urls')),
    url(r'^auth/signup/', include('rest_auth.registration.urls')),
    url(r'^account/', include('allauth.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/profile/$', RedirectView.as_view(url='/', permanent=True), name='profile-redirect'),
]
