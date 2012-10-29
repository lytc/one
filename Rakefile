begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

task :build do
  require 'closure-compiler'
  
  all = ''
  files = {
    :one      => [1, 3],
    :supports => [1, 1],
    :str      => [1, 1],
    :arr      => [1, 1],
    :fn       => [1, 1],
    :nodes    => [1, 1],
    :event    => [1, 1],
    :ajax     => [1, 1],
    :form     => [1, 1],
    :template => [1, 1],
    :transit  => [1, 1]
  }
  
  files.each do |file, lineRemove|
    #all += File.read('src/' + file.to_s + '.js').lines.to_a[lineRemove[0]..-(lineRemove[1]+1)].join
    all += File.read('src/' + file.to_s + '.js')
    all += ";\n"
  end
  
  #all = "one = (function() {\n" + all
  #all += "return $\n})()\nwindow.$ || (window.$ = one)";
  
  file = File.new('build/one.js', 'w')
  file.write(all)
  file.close()
  
  #closure = Closure::Compiler.new(:compilation_level => 'ADVANCED_OPTIMIZATIONS')
  closure = Closure::Compiler.new
  compiled = closure.compile(all) 
  
  min_file = File.new('build/one.min.js', 'w')
  min_file.write(compiled)
  min_file.close()
end

task "gh-pages" do
  # copy js to gh-pages
  system "cp build/one.js gh-pages/source/javascripts/one.js"

  # copy spec to gh-pages
  system "rm -rf gh-pages/source/javascript/spec/"
  system "cp -r spec/ gh-pages/source/javascripts/spec/"

  Dir.chdir('gh-pages') do
    system "middleman build"
  end

  # copy to one-gh-pages
  system "cp -r gh-pages/build/ ../one-gh-pages/"
end

task :default do
  Rake::Task['jasmine:ci'].invoke
  Rake::Task['build'].invoke
  Rake::Task['gh-pages'].invoke
end