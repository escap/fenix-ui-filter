define([
    'jquery'
], function ($) {

    'use strict';

    var optionsDefault = {
        containerType : '',
        title : '',
        grid : '',
        components : [],
        //This is the name of the active tab
        activeTab : '',
        widget: {
            lang: 'EN'
        },
        css_classes: {
            HOLDER: "fx-filter-holder",
            HEADER: "fx-filter-header",
            HANDLER: "fx-filter-handler",
            CONTENT: "fx-filter-content",
            CLOSE_BTN: "fx-filter-close-btn",
            MODULE: 'fx-filter-form-module',
            RESIZE: "fx-filter-resize-btn",
            LABEL: "fx-filter-label",
            ICON: "fx-filter-icon",
        },
        events: {
            REMOVE_MODULE: "fx.filter.module.remove"
        }
    }

    // A constructor for defining new container
    function Container1( o ) {

        if (this.options === undefined) {this.options = {}; }

        $.extend(true, this.options, optionsDefault, o);
    }

    Container1.prototype.getBlankContainer = function (module, components) {

       var self = this;
        var $module = $("<div class='" + (module.options.element.class ? module.options.element.class : '' ) +  " "+ (module.options.element.module_class ? module.options.element.module_class : self.options.css_classes.MODULE )  +" '></div>"),
            $header = $("<div class='" + self.options.css_classes.HEADER + "'></div>"),
            $holder = $("<div class='" + self.options.css_classes.HOLDER + "'></div>"),
            $iconHolder = $("<div class='" + self.options.css_classes.ICON + "'></div>"),
            $icon = $("<span></span>");

        $module.attr("data-module", module.options.container.containerType);
        $module.attr("data-size", "full");
        $module.attr("id", module.options.id);
        $header.append("<div class='" + self.options.css_classes.HANDLER + "'></div>");
//        $header.append("<div class='" + o.css_classes.LABEL + "'>" + cache.json[module.module]["label"][o.widget.lang] + "</div>");
        if((self.options.title!=null)&&(self.options.title!="undefined")&&(self.options.title.length>0)){
            $header.append("<div class='" + self.options.css_classes.LABEL + "' >" + self.options.title + "</div>");
        }
     
        if((self.options.icon!=null)&&(self.options.icon!="undefined")){
            if((self.options.icon.class!=null)&&(self.options.icon.class!="undefined")&&(self.options.icon.class.length>0))  {
                    $icon.attr("class", self.options.icon.class);

                if((self.options.icon.tooltip!=null)&&(self.options.icon.tooltip!="undefined")&&(self.options.icon.tooltip.length>0)) {
                    $icon.attr("title", self.options.icon.tooltip);
                    $icon.attr("data-toggle", 'tooltip');
                    $icon.attr("data-placement", 'right');
                }

                $iconHolder.append($icon);
                $header.append($iconHolder);
            }
        }

        var $resize = $("<div class='" + self.options.css_classes.RESIZE + "'></div>");
        $resize.on("click", { module: $module.get(0), btn: $resize}, function (e) {

            if ($(e.data.module).attr("data-size") === 'half') {
                $(e.data.module).attr("data-size", "full");
                $(e.data.btn).css({
                    "background-position": "-30px -15px"
                });

            } else {
                $(e.data.module).attr("data-size", "half");
                $(e.data.btn).css({
                    "background-position": "-30px 0"
                });
            }
            self.options.grid.resize(e.data.module);
        });
        $header.append($resize);

        var $close_btn = $("<div class='" + self.options.css_classes.CLOSE_BTN + "'></div>")
            .on("click", { o: self.options }, function (e) {
                $(self.options.grid.o.container).trigger(self.options.events.REMOVE_MODULE, { moduleObj: module, module: $module.get(0)});

                self.options.grid.removeItem($module.get(0));
            });

        $header.append($close_btn);
        $module.append($holder);
        $holder.append($header);
        var $content = $("<div class='" + self.options.css_classes.CONTENT + "'></div>");
        $holder.append($content);

        if(components.length>1){
            var $tabpanel = $('<div class="note-tabs"></div>');
            $content.append($tabpanel);
            var $components =  $('<ul class="nav nav-tabs"></ul>');
            $tabpanel.append($components);

            for(var iCompon=0; iCompon< components.length; iCompon++){
                var $i_component = "";
                var id_component = module.options.id+"_comp_"+iCompon;
                var title = "";
                if((components[iCompon].title!=null)&&(components[iCompon].title!="undefined")){
                    title = components[iCompon].title[components[iCompon].lang];
                }

                var comp_name = components[iCompon].name;
                if(iCompon==0){
                    $i_component =  $("<li class='active' componentname="+comp_name+"><a href='#"+id_component+"' data-toggle='tab'>"+title+"</a></li>");
                    $i_component.click( function(e) {
                        self.options.activeTab = $(this).attr("componentname");
                    });
                }
                else{
                    $i_component =  $("<li componentname="+comp_name+"><a href='#"+id_component+"' data-toggle='tab' >"+title+"</a></li>");
                    $i_component.click( function(e) {
                        self.options.activeTab = $(this).attr("componentname");
                    });
                }
                $components.append($i_component);
            }

            var $i_component_content =  $('<div class="tab-content"></div>');
            $tabpanel.append($i_component_content);

            for(var iCompon=0; iCompon< components.length; iCompon++){
                var $i_component = "";
                var id_component = module.options.id+"_comp_"+iCompon;
                if(iCompon==0){
                    $i_component =  $('<br><div class="tab-pane active" id="'+id_component+'"></div>');
                }
                else{
                    $i_component =  $('<div class="tab-pane" id="'+id_component+'"></div>');
                }
                $i_component_content.append($i_component);
            }
            var self = this;
        }
        else{
            var id_component = module.options.id+"_comp_"+0;
            $i_component =  $('<div id="'+id_component+'"></div>');
            $content.append($i_component);
        }

        $(self.options.grid.o.container).append($module);

        return $module;
    };

    Container1.prototype.render = function (e, container) {
    };

    return Container1;
});
