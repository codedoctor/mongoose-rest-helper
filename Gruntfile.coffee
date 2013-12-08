coffeeRename = (destBase, destPath) ->
  destPath = destPath.replace 'src/',''
  destBase + destPath.replace /\.coffee$/, '.js'

module.exports = (grunt) ->
  grunt.initConfig 
    #release:
    #  options:
    coffee:
      compile:
        options:
          sourceMap: true

        files: grunt.file.expandMapping(['src/**/*.coffee'], 'lib/', {rename: coffeeRename })
 
    watch:
      scripts:
        files: ['src/*.coffee']
        tasks: 'coffee'


  grunt.loadNpmTasks 'grunt-release'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'

  grunt.registerTask 'default', 'watch'
