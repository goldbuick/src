
let Screen = {
    ratioX: 1,
    ratioY: 1,
    width: 1,
    height: 1,
    halfWidth: 1,
    halfHeight: 1,
    left: coord => (-Screen.halfWidth + coord) * Screen.ratioX,
    right: coord => (Screen.halfWidth - coord) * Screen.ratioX,
    top: coord => (-Screen.halfHeight + coord) * Screen.ratioY,
    bottom: coord => (Screen.halfHeight - coord) * Screen.ratioY,
};

export default Screen;
