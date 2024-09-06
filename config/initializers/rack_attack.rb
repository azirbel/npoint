class Rack::Attack
  ### Throttle Spammy Clients ###

  # If any single client IP is making tons of requests, then they're
  # probably malicious or a poorly-configured scraper. Either way, they
  # don't deserve to hog all of the app server's CPU. Cut them off!
  #
  # Note: On a typical document page, refreshing creates 2 requests
  # (one for the document, one for the user). Doubled the default setting
  # of 60rpm so a refresh of once per second is allowed

  # Throttle all requests by IP (120rpm)
  throttle('req/ip', limit: 120 * 5, period: 5.minutes) do |req|
    req.ip unless req.path.start_with?('/assets')
  end

  # Throttle requests per document (10 per second = 600rpm)
  throttle('limit document calls by token', limit: 600, period: 1.minute) do |req|
    if req.url.match(/^https?:\/\/api./)
      # API route
      req.path.match(/\/([A-Za-z0-9]{20})/)&.[](1) # tokens are 20 chars
    elsif req.path.match(/\/documents\/[A-Za-z0-9]{20}/)
      # /documents app route
      req.path.match(/\/documents\/([A-Za-z0-9]{20})/)&.[](1) # tokens are 20 chars
    end
  end
end
