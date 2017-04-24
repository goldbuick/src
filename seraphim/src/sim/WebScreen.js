
let WebScreen = {
    ratioX: 1,
    ratioY: 1,
    width: 1,
    height: 1,
    halfWidth: 1,
    halfHeight: 1,
    left: coord => (-WebScreen.halfWidth + coord) * WebScreen.ratioX,
    right: coord => (WebScreen.halfWidth - coord) * WebScreen.ratioX,
    top: coord => (-WebScreen.halfHeight + coord) * WebScreen.ratioY,
    bottom: coord => (WebScreen.halfHeight - coord) * WebScreen.ratioY,
};

export default WebScreen;
