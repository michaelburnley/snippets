# Simple script to download images from a file with the same URL base.
# Pass in the input file, and the base of the url:
# e.g. down.rb download.txt http://cdn.zooshoo.com/amazon_pics/

rfile = ARGV

require "open-uri"
require 'uri'

text=File.open(ARGV[0]).read
text.gsub!(/\r\n?/, "\n")
text.each_line do |line|
  puts line
    file_name = File.basename(line).chomp
    uri_convert = URI.escape(line.chomp)
    begin
          open("#{uri_convert}") {|f|
            File.open(file_name, 'wb') do |file|
              file.puts f.read
            end
          }
    rescue OpenURI::HTTPError => error
          response = error.io
          puts response.status
          puts response.string
    end
end
