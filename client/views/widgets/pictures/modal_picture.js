Template.modal_picture.rendered = function(){
    $('a.modal_picture').click(function(e){
        e.preventDefault();
        $('#previewImage').attr('src', $(this).data('url'));
        $('#modalImage').modal('show');
    })
};