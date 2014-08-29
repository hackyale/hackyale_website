#root
get '/' do
  erb :index
end

get '/jobs' do
  erb :jobs
end

#panel pages, handle anchor redirects
pages = %w[about courses team]
route_rgx = %r{^/(#{pages.join '|'})$}i # case-insensitive
get route_rgx do
  redirect "/#" + params[:captures].first.downcase
end

#map all stylesheets to scss
get '/stylesheets/:name.css' do
  content_type 'text/css', :charset => 'utf-8'
  scss :"/../public/stylesheets/#{params[:name]}"
end
