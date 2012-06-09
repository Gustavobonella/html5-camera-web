define([
  'jQuery', # lib/jquery/jquery
  'Kendo'
  'libs/webgl/effects'
  'mylibs/utils/utils'
  'text!mylibs/preview/views/preview.html'
], ($, kendo, effects, utils, template) ->
    
    paused = false
    canvas = {}
    video = {}
    previews = []
    $container = {}
    webgl = fx.canvas()
    frame = 0

    update = ->

        
        if not paused

            # get the 2d canvas context and draw the image
            # this happens at the curent framerate
            
            canvas2d = canvas.getContext('2d')
            canvas2d.clearRect()
            canvas2d.drawImage(video, 0, 0, video.width, video.height)
            
            # for each of the preview objects, create a texture of the 
            # 2d canvas and then apply the webgl effect. these are live
            # previews
            for preview in previews

                frame++

                # texture = preview.canvas.texture(canvas)

                #preview.canvas.draw(texture)
                
                preview.filter(preview.canvas, canvas, frame)

                #preview.canvas.update()

                #texture.destroy()
                
    draw = ->

        utils.getAnimationFrame()(draw)
        update()
    
    pub = 
        
        # draw the stream to the canvas at the max framerate
        draw: ->
            
            draw()
            
        
        init: (container, c, v) ->
            
            $.subscribe("/previews/show", ->
                video.width = canvas.width = 200   
                video.height = canvas.height = 150
                $container.kendoStop(true).kendoAnimate({ effects: "zoomIn fadeIn", show: true, duration: 500, complete: ->
                    $("footer").kendoStop(true).kendoAnimate({ effects: "fadeIn", show: true, duration: 200 })
                    paused = false
                })
            )
            
            previews = []
            
            #canvas = document.createElement("canvas")
            
            #canvas = $("#screen")[0]

            canvas = document.createElement "canvas"

            video = v
            
            $container = $("##{container}")
            
            video.width = canvas.width = 200   
            video.height = canvas.height = 150
            
            # get back the presets and create a custom object
            # that we can use to dynamically create canvas objects
            # and effects

            $currentPage = {};
            $nextPage= {};

            ds = new kendo.data.DataSource
                    
                    data: effects
                    
                    pageSize: 6
                    
                    change: ->

                        $currentPage = $container.find(".current-page")
                        $nextPage = $container.find(".next-page")

                        paused = true

                        previews = []

                        for item in this.view()

                            do ->

                                preview = {}
                                $.extend(preview, item)

                                preview.name = item.name
                                preview.canvas = fx.canvas()
                                            
                                previews.push(preview)
                            
                                $a = $("<a href='#' class='preview'></a>").append(preview.canvas).click(->
                                    paused = true
                                    $("footer").kendoStop(true).kendoAnimate({ effects: "fadeOut", hide: true, duration: 200 })
                                    $container.kendoStop(true).kendoAnimate({ effects: "zoomOut fadeOut", hide: true, duration: 500 })
                                    $.publish("/preview/show", [preview])
                                )

                                $nextPage.append($a)

                                $currentPage.kendoStop(true).kendoAnimate { effects: "slide:down fadeOut", duration: 500, hide: true, complete: ->

                                    $currentPage.removeClass("current-page").addClass("next-page")
                                    $currentPage.find("a").remove()

                                }   

                                $nextPage.kendoStop(true).kendoAnimate { effects: "fadeIn", duration: 500, show: true, complete: ->

                                    $nextPage.removeClass("next-page").addClass("current-page")
                                    paused = false

                                }


            $container.on "click", ".more", ->

                paused = true

                if ds.page() < ds.totalPages()

                    ds.page(ds.page() + 1)            

                else

                    ds.page(1)


            ds.read()
                    
                
        pause: () ->
            
            paused = true

        resume: () ->
            
            paused = false  
            
        capture: (callback) ->
            
            webgl.ToDataURL
        
            

        
        
    
)