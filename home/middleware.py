from django.utils.deprecation import MiddlewareMixin

class ResetSessionMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if not request.session.get('logged_in'):
            request.session['logged_in'] = False
