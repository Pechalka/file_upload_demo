

var bus = $({});


var List = function(){
    var self = this;

    self.statuses = ['Checked', 'Invalid', 'Not hecked'];

    self.items = ko.observableArray([]);

    var fetch = function(){
        $.get('/api/docs', self.items);
    }

    self.show = function(item, el){
        bus.trigger('show-docs', item);  
        $(el.target).popover('hide')    
    }

    self.download = function(item){
        alert('download');
    }

    self.activate = function(){
        fetch();
    }

    self.toggle = function(item, el, a, b, c){
        var html = 'XYU';
        var $el = $(el.target);
        var html = '<ul>';

        for (var i = item.files.length - 1; i >= 0; i--) {
            html += '<li>' + item.files[i] + '</li>';
        };
        
        html += '</ul>';

        $el.attr('data-content', html);
        $el.attr('data-original-title', item.title);

        $el.popover('toggle')
    }

    self.template = 'list';
}


var app = {
    popup : ko.observable(),
    page : ko.observable()
};



var Documents = function(doc_id){
    var self = this;

    self.activate = function(){

        $('#fileupload').fileupload({
            disableImageResize: false,
            url: '/uploads/' + doc_id
        });

        $('#fileupload').addClass('fileupload-processing');
        $.ajax({
            url: $('#fileupload').fileupload('option', 'url'),
            dataType: 'json',
            context: $('#fileupload')[0]
        }).always(function () {
            $(this).removeClass('fileupload-processing');
        }).done(function (result) {
            $(this).fileupload('option', 'done')
                .call(this, $.Event('done'), {result: result});
        });
    }

    self.template = 'app';
}

bus.on('show-docs', function(e, data){
    app.popup(new Documents(data.id) );
    app.popup().activate();
    $('#documents-popup').modal('show'); 
    $('#documents-popup').on('hide.bs.modal', function(){
        app.page().activate();
    })
})

$(function () {
    'use strict';

    ko.applyBindings(app);

    app.popup(new Documents(1));
    app.popup().activate();

    app.page(new List());
    app.page().activate();

});

