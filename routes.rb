#root
get '/' do
  erb :index
end

get '/privacy' do
  erb :privacy
end

get '/about' do
  erb :privacy
end

#map all stylesheets to sass
get '/stylesheets/:name.css' do
 content_type 'text/css', :charset => 'utf-8'
 scss(:"/../public/stylesheets/#{params[:name]}")
end