// desktop needs innerWidth
var getWidth = function() {
    return document.documentElement.clientWidth;
}

var getHeight = function() {
    return document.documentElement.clientHeight;
}

/**
 * Checks if the game is landscape of potrait
 * @returns true if the window is being displayed in landscape
 */
function isLandscape() {
    return getHeight() < getWidth();
}

/**
 * @returns true if the device is an iPhone with a notch
 */
function hasNotch() {
    return navigator.userAgent.match(/(iPhone)/) && window.innerWidth * window.innerHeight == "304500";
}

/**
 * Enters full screen if possible, or does nothing
 * @returns true if we could get fullscreen, otherwise false
 */
function requestFullscreen() 
{
    if(canvas.requestFullscreen)
    {
        canvas.requestFullscreen();
        return true;
    } else if(canvas.webkitRequestFullscreen)
    {
        canvas.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        return true;
    } else if(canvas.msRequestFullscreen)
    {
        canvas.msRequestFullscreen();
        return true;
    }

    return false;
}

/**
 * Exits full screen mode if possible
 */
function exitFullscreen() {
    if(canvas.requestFullscreen)
    {
        canvas.exitFullscreen();
    } else if(canvas.webkitRequestFullscreen)
    {
        canvas.webkitExitFullscreen();
    } else if(canvas.msRequestFullscreen)
    {
        canvas.msExitFullscreen();
    }
}

/**
 * Reads the game title embeded inside the ROM
 * @returns String
 */
function readROMName() {
    let str = "";
    let i = 0;

    if(c.mem.rom[0x134] == 0)
        return null;

    do {
        str += String.fromCharCode(c.mem.rom[0x134 + i]);
        i++;
    } while(i <= 16 && c.mem.rom[0x134 + i] != 0);
    return str;
}

/**
 * Converts a value into a hexidemical string
 * @param {any} v 
 */
function hex(v) {
    return "0x" + v.toString(16);
}


/**
 * Shows a menu to prompt the user to save text
 * - must be called from an event
 * @param {String} text string to save
 */
function copyClipMenu(text) {
    const elem = document.getElementById('copyTextInput');
    const menuDiv = document.getElementById('textCopyPopup');
    elem.value = text;
    elem.focus();
    console.log("show clipboard menu");

    // show menu
    menuDiv.style.display = 'block';
    menuDiv.style.opacity = "1";
}


/**
 * Copies to clipboard
 * - must be called by a reputable event
 * - copies text inside of 'copyTextInput'
 */
function clipboardCopy() {
    const elem = document.getElementById('copyTextInput');
    
    elem.readonly = false;
    elem.contentEditable = true;
    elem.select();

    const range = document.createRange();
    range.selectNodeContents(elem);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    
    
    elem.setSelectionRange(0, 999999);
    
    document.execCommand("copy");
    
    // hide menu
    document.getElementById('textCopyPopup').style.display = 'none';

    // because the size is huge, we will empty the text inside it
    elem.value = "";
    
    // show success message
    showMessage("Copied to clipboard", "Success");
}


const messageDiv = document.getElementById('messageID');
const messageConfirm = document.getElementById('messageConfirm');

messageConfirm.onclick = hideMessage;

/**
 * Shows a message to the user
 * @param {String} string message to tell
 * @param {String?} title string to display at the top
 */
function showMessage(string, title) {
    const messageContent = document.getElementById('messageContent');
    const messageHeader = document.getElementById('messageHeader');
    messageContent.innerHTML = string;
    messageHeader.textContent = title || "ALERT";
    // show 
    messageDiv.style.display = "block";
    
    messageDiv.style.opacity = "1";
}


function hideMessage() {
    // hide
    messageDiv.style.opacity = "0";
    setTimeout(function() {
        messageDiv.style.display = "none";
    }, 600);
}


// color palette
const changePaletteButton = document.getElementById('changePaletteButton');
const paletteSetDiv = document.getElementById('paletteSetDiv');
const colorPreview = document.getElementById('colorPreview');

// color elements
const r = document.getElementById('colorR');
const g = document.getElementById('colorG');
const b = document.getElementById('colorB');

// color index
let colorIndex = 0;


changePaletteButton.onclick = function() {
    paletteSetDiv.style.display = 'block';
}

// hides the palette selection menu
function hidePaletteMenu() {
    paletteSetDiv.style.display = 'none';
}

// sets the preview color's background color
const setPreviewCol = function() {
    const col = "rgb(" + r.value + ', ' + g.value + ', ' + b.value + ')';

    colorPreview.style.backgroundColor = col;
}

/**
 * Called when the color input changes its value
 */
function onPaletteChange()
{
    setPreviewCol();
    palette[colorIndex][0] = Number(r.value);
    palette[colorIndex][1] = Number(g.value);
    palette[colorIndex][2] = Number(b.value);
}

/**
 * Changes the color index that the user is editing
 * @param dir -1 to move left or 1 to move right
 */
function onPaletteArrow(dir) {
    colorIndex = (colorIndex + dir) & 3;
    document.getElementById('paletteTitle').innerText = "Color " + colorIndex;
    
    r.value = palette[colorIndex][0];
    g.value = palette[colorIndex][1];
    b.value = palette[colorIndex][2];
    setPreviewCol();
}