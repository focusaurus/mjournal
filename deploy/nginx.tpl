# Install to /etc/nginx/sites-available/{{MJ_DOMAIN}}
# and symlink as /etc/nginx/sites-enabled/{{MJ_DOMAIN}}
upstream express-{{MJ_DOMAIN}} {
  # fail_timeout=0 means we always retry an upstream even if it failed
  # to return a good HTTP response
  server localhost:{{MJ_PORT}} fail_timeout=0;
}

#Redirect http to https
server {
  listen 80;
  server_name {{MJ_DOMAIN}};
  rewrite ^(.*) https://{{MJ_DOMAIN}}$1 permanent;
}

# HTTPS server
server {
  listen 443;
  server_name {{MJ_DOMAIN}};
  ssl on;
  charset utf-8;
  ssl_certificate /home/acme/.acme.sh/{{MJ_DOMAIN}}_ecc/fullchain.cer;
  ssl_certificate_key /home/acme/.acme.sh/{{MJ_DOMAIN}}_ecc/{{MJ_DOMAIN}}.key;
  ssl_dhparam sites-available/{{MJ_DOMAIN}}.dhparam.pem;

  #https://wiki.mozilla.org/Security/Server_Side_TLS#Recommended_Ciphersuite
  ssl_ciphers 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK';
  ssl_session_timeout 5m;
  ssl_protocols TLSv1.2 TLSv1.1;
  ssl_prefer_server_ciphers on;
  ssl_session_cache shared:SSL:5m;
  #https://www.ssllabs.com/downloads/SSL_TLS_Deployment_Best_Practices_1.3.pdf
  add_header Strict-Transport-Security max-age=15768000;

  #Don't use www subdomain
  if ($host = 'www.{{MJ_DOMAIN}}' ) {
    rewrite ^/(.*)$  https://{{MJ_DOMAIN}}/$1 permanent;
  }

  location @app {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
    # needed to forward user's IP address to the app server
    proxy_set_header X-Real-IP $remote_addr;
    #needed for HTTPS
    proxy_set_header Host $http_host;
    proxy_redirect off;
    proxy_max_temp_file_size 0;
    proxy_pass http://express-{{MJ_DOMAIN}};
  }

  location / {
    root /var/www/{{MJ_DOMAIN}};
    access_log /var/log/nginx/{{MJ_DOMAIN}}.access.log;
    error_log /var/log/nginx/{{MJ_DOMAIN}}.error.log;

    # http://bogomips.org/unicorn.git/tree/examples/nginx.conf?id=v3.3.1#n127
    try_files down.html @app;
  }

  location /.well-known/acme-challenge/ {
    alias /var/www/letsencrypt/.well-known/acme-challenge/;
  }
}

# For first-time initial bootstrap of TLS with acme only
# server {
#   listen 80;
#   server_name {{MJ_DOMAIN}};
#
#   location /.well-known/acme-challenge/ {
#     alias /var/www/letsencrypt/.well-known/acme-challenge/;
#   }
# }
