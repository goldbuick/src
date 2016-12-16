
export const gameFontName = 'Press Start 2P';

export function gameText(game, { 
    x = 0, y = 0, text = '', fontSize = 32, color = '#fff' } = {}) {
    let obj = game.add.text(x, y, text);

    obj.anchor.set(0.5, 0.5);
    obj.font = gameFontName;
    obj.fill = color;
    obj.stroke = '#000';
    obj.strokeWidth = 1;
    obj.fontSize = fontSize;
    // obj.setShadow(0, 0, 'rgba(0,0,0,0.75)', 5);

    return obj;
}
