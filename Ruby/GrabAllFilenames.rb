directory, to_file, file_type = ARGV
if directory == "here" || directory == "this"
	directory = Dir.pwd
elsif directory.include?("/") == false
	puts "Please provide a valid directory."
	exit
end
writeFile = open(to_file,'w')
fulldirectory = String(directory + '/*.' + file_type)
Dir.glob(fulldirectory).each {|file| writeFile.write(file);writeFile.write("\n");}
writeFile.close