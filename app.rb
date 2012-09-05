#shotgun ./app.rb -p 3000

#dependencies
require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'sass'

#include routes
require File.join(File.dirname(__FILE__), 'routes')


