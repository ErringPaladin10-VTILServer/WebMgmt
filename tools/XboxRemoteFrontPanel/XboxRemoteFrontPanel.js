// JavaScript source code
///<reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2-vsdoc.js" />



var frontPanel = new XboxRemoteFrontPanel();

function globalCloseConnection()
{
    frontPanel.remoteFrontPanelConnection.closeConnection();
}


function RemoteFrontPanelConnection(callbacks) {
    var self = this;
    self.callbacks = callbacks;

    var websocketProtocol = (document.location.protocol === 'https:' ? 'wss://' : 'ws://');
    var host = websocketProtocol + window.location.host + '/ext/frontpanel';

    self.socket = new WebSocket(host);

    self.socket.onmessage = function (messageEvent) {
        self.callbacks.onmessage(JSON.parse(messageEvent.data));
    };

    self.socket.onerror = function () {
        if (self.callbacks.onerror) {
            self.callbacks.onerror();
        }
    };

    self.socket.onclose = function () {
        if (self.callbacks.onclose) {
            self.callbacks.onclose();
        }
    };

    this.pressButton = function (buttonString) {
        if (isAlive()) {
            self.socket.send(buttonString);
        }
    };

    function isAlive() {
        return (self.socket &&
                (self.socket.readyState === WebSocket.OPEN || self.socket.readyState === WebSocket.CONNECTING));
    }
    this.IsAlive = isAlive;

    this.closeConnection = function() {
        //shut down socket on x button press
        if (isAlive()) {
            self.socket.close();
        }
    }

    window.addEventListener("unload", self.closeConnection, false);
};

function zoomFrontPanelCanvas()
{
    var canvasElement = document.getElementById('frontPanelCanvas');
    if(canvasElement.clientWidth===256)
    {
        canvasElement.style.width = "512px";
        document.getElementById('zoomButton').innerHTML = "&#8209;";
    }
    else
    {
        canvasElement.style.width = "256px";
        document.getElementById('zoomButton').textContent = "+";
    }
}

function buttonLift(event){
    event.target.isButtonDown = false;
    this.remoteFrontPanelConnection.pressButton('none');
}

function keyboardPressButton(event)
{
    // keyCode 13 is enter and keyCode 32 is space
    if(event.keyCode === 13 || event.keyCode === 32)
    {
        this.remoteFrontPanelConnection.pressButton(event.target.buttonName);
    }
}

function pressDownButton(event)
{
    event.target.isButtonDown = true;
    this.remoteFrontPanelConnection.pressButton(event.target.buttonName);
}

function pressSwitchButton(event)
{
    event.target.isButtonDown = true;
    this.remoteFrontPanelConnection.pressButton('switch');
}

function buttonMouseOut(event){
    if (event.target.isButtonDown) {
        this.remoteFrontPanelConnection.pressButton("none");
        event.target.isButtonDown = false;
    }
}

function setupButtonListener(id, message, remoteFrontPanel)
{
    var button = document.getElementById(id);
    button.addEventListener('keyup', keyboardPressButton.bind(remoteFrontPanel), false);
    button.addEventListener('mousedown', pressDownButton.bind(remoteFrontPanel), false);
    button.buttonName = message;
    button.isButtonDown = false;
    button.addEventListener('mouseup', buttonLift.bind(remoteFrontPanel), false);

    // Resets button state in case of mousedown on button and mouseup off the button.
    button.addEventListener('mouseout', buttonMouseOut.bind(remoteFrontPanel), false);
}

function setupButtonListenerWithSwitchOnLongPress(id, message, remoteFrontPanel)
{
    var switchButton = document.getElementById('switchButton');
    if(switchButton == null)
    {
        alert('Switch button not found');
        return;
    }

    setupButtonListener('switchButton', 'switch', this);

    var button = document.getElementById(id);
    var longPressStartTime;

    resetHeldButtonTimer = function()
    {
        switchActivated = false;
        isMouseHeldOnButton = false;
        button.style.color = "white";
        clearTimeout(checkForHeld);
    }

    var switchActivated = false;
    var isMouseHeldOnButton = false;
    var checkForHeld;
    button.addEventListener('mousedown',
    function()
    {
        pressDownButton.bind(remoteFrontPanel)
        isMouseHeldOnButton = true;
        clearTimeout(checkForHeld);
        checkForHeld = 
        setTimeout(function()
        {
            if(isMouseHeldOnButton)
            {
                switchActivated = true;
                button.style.color = "#5DC21E";
            }
        }, 2000);
    },
    false);
    

    button.buttonName = message;
    button.isButtonDown = false;
    button.addEventListener('mouseup',
    function()
    {
        buttonLift.bind(remoteFrontPanel)
        isMouseHeldOnButton = false;
        if(switchActivated){
            Wdp.Utils.Xbox.RemoteFrontPanel.connection.pressButton('switch');
        }
        resetHeldButtonTimer();
    },
    false);

    // Resets button state in case of mousedown on button and mouseup off the button.
    button.addEventListener('mouseout', function(){
        buttonMouseOut.bind(remoteFrontPanel)
        resetHeldButtonTimer();
    }, false);
}

function XboxRemoteFrontPanel() {
    var self = this;

    // Assign button click listeners
    setupButtonListener('upButton', 'up', this);
    setupButtonListener('downButton', 'down', this);
    setupButtonListener('leftButton', 'left', this);
    setupButtonListener('rightButton', 'right', this);
    setupButtonListener('oneButton', 'one', this);
    setupButtonListener('twoButton', 'two', this);
    setupButtonListener('threeButton', 'three', this);
    setupButtonListener('fourButton', 'four', this);
    setupButtonListener('fiveButton', 'five', this);

    var zoomButton = document.getElementById('zoomButton');
    if(zoomButton != null)
    {
        zoomButton.addEventListener('mouseup', zoomFrontPanelCanvas);
    }
    else
    {
        setupButtonListenerWithSwitchOnLongPress('selectButton', 'select', this);
        var canvasElement = document.getElementById('frontPanelCanvas');
        canvasElement.style.width = "512px";
    }

    Wdp = Wdp || {};
    Wdp.Utils = Wdp.Utils || {};
    Wdp.Utils.Xbox = Wdp.Utils.Xbox || {};
    Wdp.Utils.Xbox.RemoteFrontPanel = Wdp.Utils.Xbox.RemoteFrontPanel || {};

    self.sessionsViewer = new FrontPanelBufferHandler();

    if (!Wdp.Utils.Xbox.RemoteFrontPanel.connection || !Wdp.Utils.Xbox.RemoteFrontPanel.connection.IsAlive()) {
        function onMessage(data) { self.sessionsViewer.onBufferAvailable(data); }

        function onError() {
            $('#frontPanelStatus')
                .text("Connection to device lost. Refresh the page to reconnect.")
                .removeClass("hidden");
        };
        
        function onClose() {
            $('#frontPanelStatus')
                .text("Connection to device lost. Refresh the page to reconnect.")
                .removeClass("hidden");
        };

        Wdp.Utils.Xbox.RemoteFrontPanel.connection = new RemoteFrontPanelConnection({onerror: onError, onclose: onClose, onmessage: onMessage });
    }

    self.remoteFrontPanelConnection = Wdp.Utils.Xbox.RemoteFrontPanel.connection;
};

function decodeBase64ToArrayBuffer(base64Buffer) {
    var binaryString =  window.atob(base64Buffer);
    var byteArray = new Uint8Array( binaryString.length );
    for (var i = 0; i < binaryString.length; i++)
    {
        byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray;
}

function FrontPanelBufferHandler() {
    var self = this;

    this.onBufferAvailable = function (data) {
        var bufferCanvas = document.getElementById('frontPanelCanvas');
        // If canvas not available, user navigated to different workspace.
        // Close pipe to prevent running in background.
        if(!bufferCanvas)
        {
            globalCloseConnection();
            return;
        }
        else if (!$('#frontPanelStatus').hasClass('hidden'))
        {
            $('#frontPanelStatus').addClass('hidden');
        }
        
        bufferCanvas.width = 256;
        bufferCanvas.height = 64;

        var byteBuffer = decodeBase64ToArrayBuffer(data.FrontPanelBuffer);
        
        
        var ctx = bufferCanvas.getContext('2d');
        var image = ctx.createImageData(256,64);

        var leftWordMask = 0xF0;
        var rightWordMask = 0x0F;

        // Convert from 4bpp to 32bpp
        for(var i=0; i < byteBuffer.length; i+=1) {
            var lum = byteBuffer[i];
            
            var rightWord = lum & rightWordMask;

            var leftWordPreshifted = lum & leftWordMask;
            var leftWord = leftWordPreshifted >> 4;

            var leftLum = (leftWord / 16) * 255;
            var rightLum = (rightWord / 16) * 255;
  
            image.data[i*8] = leftLum
            image.data[(i*8)+1] = leftLum;
            image.data[(i*8)+2] = leftLum;
            image.data[(i*8)+3] = 255;

            image.data[(i*8)+4] = rightLum
            image.data[(i*8)+5] = rightLum;
            image.data[(i*8)+6] = rightLum;
            image.data[(i*8)+7] = 255;
        }
        ctx.putImageData(image, 0, 0);
    };
}

//@ sourceURL=tools/XboxRemoteFrontPanel/XboxRemoteFrontPanel.js
