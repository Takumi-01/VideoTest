'use strict';

let localStream = null;
let peer = null;
let existingCall = null;

navigator.mediaDevices.getUserMedia({video: true, audio: true})
	.then(function (stream) {
		// 成功
		$('#my-video').get(0).srcObject = stream;
		localStream = stream;
	}).catch(function (error) {
	    // 失敗
	    console.error('mediaDevice.getUserMedia() error:', error);
	    return;
	});


	peer = new Peer({
		key: '1b0e75e4-c7ac-40c9-be88-f592da60af62',
		debug: 3
	});

	//接続
	peer.on('open', function(){
		$('#my-id').text(peer.id);
	});

	//エラー
	peer.on('error', function(err){
		alert(err.message);
	});

	//接続切れ
	peer.on('close', function(){
	});

	//サーバ接続切れ
	peer.on('disconnected', function(){
	});

	//発信処理
	$('#make-call').submit(function(e){
		e.preventDefault();
		const call = peer.call($('#callto-id').val(), localStream);
		setupCallEventHandlers(call);
	});

	//切断処理
	$('#end-call').click(function(){
		existingCall.close();
	});

	//着信処理
	peer.on('call', function(call){
		call.answer(localStream);
		setupCallEventHandlers(call);
	});

	function setupCallEventHandlers(call){
	    if (existingCall) {
	        existingCall.close();
	    };

	    existingCall = call;

	    call.on('stream', function(stream){
	        addVideo(call,stream);
	        setupEndCallUI();
	        $('#their-id').text(call.remoteId);
	    });
	    
	    call.on('close', function(){
	        removeVideo(call.remoteId);
	        setupMakeCallUI();
	    });
	}

	//再生
	function addVideo(call,stream){
	    $('#their-video').get(0).srcObject = stream;
	}

	//削除
	function removeVideo(peerId){
	    $('#' + peerId).remove();
	}

	//ボタン切替
	function setupMakeCallUI(){
	$('#make-call').show();
	$('#end-call').hide();
	}

	function setupEndCallUI() {
	    $('#make-call').hide();
	    $('#end-call').show();
	}