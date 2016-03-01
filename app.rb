require 'sinatra'
require 'shotgun'

class App < Sinatra::Application

  get '/' do
    send_file 'index.html'
  end

  get '/pantry' do
    send_file 'pantry.html'
  end

  get '/login' do
    send_file 'login.html'
  end

end

