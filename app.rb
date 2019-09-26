require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'sass'

configure :production do
  require 'newrelic_rpm'
end

# Include routes
require File.join(File.dirname(__FILE__), 'routes')
