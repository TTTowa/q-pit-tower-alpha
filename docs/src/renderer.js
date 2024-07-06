const { Engine, Render, Runner, Bodies, World, Mouse, MouseConstraint, Events, Svg } = Matter;

// const suika = require('./suika.png');
const suika = document.getElementById('suikaImg').src
const tmpsvg = document.getElementById('tmpsvg').src
// const getVerticesFromSvg = async (path) => {
//     const svgDoc = await fetch(path)
//       .then((response) => response.text())
//       .then((svgString) => {
//         // SVG文字列からpathデータを抽出
//         const parser = new DOMParser();
//         return parser.parseFromString(svgString, "image/svg+xml");
//       });
//     const pathDatas = svgDoc.querySelectorAll("path");
//     if (!pathDatas) return;
//     // pathデータをverticesに変換
//     const vertices = Array.from(pathDatas).map((pathData) => {
//       return Matter.Svg.pathToVertices(pathData, 10);
//     });
//     return vertices;
//   };

//   function setPathData(pathData) {
//     let parts = pathData && pathData.match(/[mlhvcsqtaz][^mlhvcsqtaz]*/ig),
//         coords;
//     let array = [];

//     for (let i = 0, l = parts && parts.length; i < l; i++) {
//       coords = parts[i].match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g);

//       for (let j = 0; j < coords.length; j+=2) {
//         array.push({
//           x: +coords[j],
//           y: +coords[j + 1]
//         })
//       }
//     }

//     return array;
//   }

//   console.log(await getVerticesFromSvg(ChottySvg))









// エンジンとワールドを作成
const engine = Engine.create();
const world = engine.world;

// キャンバスの幅と高さを設定
const width = 720;
const height = 800;

// レンダラーを作成
const render = Render.create({
    element: document.querySelector('.game-wrap'),
    engine: engine,
    options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent'
    },
});

Render.run(render);

// ランナーを作成
const runner = Runner.create();
Runner.run(runner, engine);

// 床を作成
const ground = Bodies.rectangle(width / 2, height - 100, 500, 20, { isStatic: true });
const left = Bodies.rectangle(120, height - 120, 20, 60, { isStatic: true });
const right = Bodies.rectangle(width- 120, height - 120, 20, 60, { isStatic: true });
World.add(world, [left, right, ground]);

engine.world.gravity.y = 0.5;

// function createSemiCircleVertices(radius, sides, rotation) {
//     const angleStep = Math.PI / sides;
//     const vertices = [];

//     for (let i = 0; i <= sides; i++) {
//       const angle = i * angleStep - Math.PI / 2 + rotation;
//       const x = Math.cos(angle) * radius;
//       const y = Math.sin(angle) * radius;
//       vertices.push({ x: x, y: y });
//     }

//     vertices.push({ x: 0, y: 0 }); // 半円を閉じるための頂点を追加

//     return vertices;
//   }

//   // 半円を作成
//   const rotationAngle = Math.PI / 4; // 回転角度（ラジアン）
//   const semiCircleVertices = createSemiCircleVertices(50, 50, rotationAngle);
//   const semiCircle = Bodies.fromVertices(400, 100, [semiCircleVertices], {
//     render: { fillStyle: 'blue',
//         sprite: {
//             texture: tmpsvg
//         }
//      }
//   });
//   World.add(engine.world, semiCircle);

function resizeImage(src, targetWidth, targetHeight, callback) {
    const img = new Image();

    img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // ターゲットサイズに合わせてキャンバスのサイズを設定
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // 画像をキャンバスに描画してリサイズする
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // リサイズ後の画像をデータURLとして取得
        const resizedImageDataUrl = canvas.toDataURL('image/png');

        // コールバック関数で処理結果を返す
        callback(null, resizedImageDataUrl);
    };

    img.onerror = function (error) {
        callback(error);
    };

    // 画像の読み込みを開始
    img.src = src;
}

function createSemiCircleVertices(radius, sides, rotation) {
    const angleStep = Math.PI / sides;
    const vertices = [];

    for (let i = 0; i <= sides; i++) {
        const angle = i * angleStep - Math.PI / 2 + rotation;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        vertices.push({ x: x, y: y });
    }

    vertices.push({ x: 0, y: 0 }); // 半円を閉じるための頂点を追加

    return vertices;
}

// 半円の作成と画像の設定
const rotationAngle = Math.PI / 4; // 回転角度（ラジアン）
const semiCircleRadius = 50; // 半円の半径
const imageSrc = tmpsvg; // 画像のURL
const targetWidth = semiCircleRadius * 2; // 半円の直径と同じ幅に設定
const targetHeight = semiCircleRadius * 2; // 半円の直径と同じ高さに設定

// 画像をリサイズしてテクスチャとして使用する
function addq(mouseX, mouseY) {
    resizeImage(imageSrc, targetWidth, targetHeight, function (error, resizedImageUrl) {
        if (error) {
            console.error('画像のリサイズ中にエラーが発生しました。', error);
        } else {
            console.log('リサイズされた画像のURL:', resizedImageUrl);

            // Matter.jsで半円を作成し、リサイズされた画像をテクスチャとして設定
            const semiCircleVertices = createSemiCircleVertices(semiCircleRadius, 50, rotationAngle);

            console.log(semiCircleVertices);

            const semiCircle = Bodies.fromVertices(400, 100, [semiCircleVertices], {
                render: {
                    fillStyle: 'blue',
                    sprite: {
                        texture: resizedImageUrl // リサイズされた画像をテクスチャとして設定
                    }
                }
            });


            // 新しい半円を生成して追加
            const newSemiCircle = Matter.Bodies.fromVertices(mouseX, mouseY, [semiCircleVertices], {
                render: {
                    fillStyle: 'blue',
                    sprite: {
                        texture: resizedImageUrl // リサイズされた画像をテクスチャとして設定
                    }
                }
            });

            World.add(engine.world, newSemiCircle);

            // Matter.jsの世界に半円を追加
            //   World.add(engine.world, semiCircle);
        }
    });
}




// 床に接触している円の個数をカウント
let circleCount = 0;
let pointCount = 0;
const groundY = height;


// カウント表示用のdivを作成
const counterDiv = document.createElement('div');
counterDiv.style.position = 'absolute';
counterDiv.style.top = '100px';
counterDiv.style.left = '100px';
counterDiv.style.fontSize = '20px';
counterDiv.style.color = 'white';
document.body.appendChild(counterDiv);


// ポイントのdivを作成
const pointDiv = document.createElement('div');
pointDiv.style.position = 'absolute';
pointDiv.style.top = '200px';
pointDiv.style.left = '100px';
pointDiv.style.fontSize = '20px';
pointDiv.style.color = 'white';
document.body.appendChild(pointDiv);



// カウンターを更新する関数
function updateCounter() {
    counterDiv.textContent = `Count: ${circleCount}`;
    pointDiv.textContent = `Point: ${pointCount}`;
}

updateCounter();

// クリックイベントをリッスン
render.canvas.addEventListener('click', function (event) {
    handleEvent(event);
});

// タッチイベントをリッスン
render.canvas.addEventListener('touchstart', function (event) {
    // タッチイベントのデフォルト動作を無効にする
    event.preventDefault();
    handleEvent(event.touches[0]);
});

function createTriangleAtMousePosition(mouseX, mouseY) {
    const triangle = Bodies.polygon(mouseX, mouseY, 3, 50, {
        restitution: 0.5, // 反発係数
        angle: Math.PI / 4 // 角度
    });
    World.add(engine.world, triangle);
}

function createRectangleAtMousePosition(mouseX, mouseY) {
    const rectangle = Bodies.rectangle(mouseX, mouseY, 80, 80, {
        restitution: 0.5, // 反発係数
        angle: 0 // 角度
    });
    World.add(engine.world, rectangle);
}

function handleEvent(event) {
    // クリックまたはタッチ位置を取得
    const rect = render.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // 円を生成
    // const circle = createTexturedCircle(mouseX, mouseY, 20);

    const radius = getRandomNumber();
    pointCount += radius;

    function generateRandomNumberInRange(start, end) {
        // 指定された範囲からランダムに一つの数字を生成する関数
        const randomNumber = Math.floor(Math.random() * (end - start + 1)) + start;
        return randomNumber;
    }

    const num = generateRandomNumberInRange(0, 12);
    if (num === 0) {
        createTexturedCircle(mouseX, mouseY, radius, suika);
    } else if (num == 1) {
        addq(mouseX, mouseY);
    } else if (2 <= num && num <= 5) {
        createTriangleAtMousePosition(mouseX, mouseY);
    } else if (6 <= num && num <= 12){
        createRectangleAtMousePosition(mouseX, mouseY)
    }


    // World.add(world, circle);
    circleCount++;
    updateCounter();
}
function getRandomNumber() {
    // Math.random() は 0 以上 1 未満の乱数を生成する
    const randomNumber = Math.random();

    // 20から40までの範囲にスケーリングする
    const scaledNumber = 20 + randomNumber * (80 - 20);

    // 整数にする場合は Math.floor() を使用する
    return Math.floor(scaledNumber);
}


// 画像を読み込んでリサイズする関数
function loadImageAndResize(url, width, height, callback) {
    const image = new Image();
    image.onload = function () {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // キャンバスのサイズを設定
        canvas.width = width;
        canvas.height = height;

        // 画像をキャンバスに描画してリサイズ
        context.drawImage(image, 0, 0, width, height);

        // リサイズした画像をコールバック関数で渡す
        callback(canvas.toDataURL()); // ここでは Base64 形式のデータを返す
    };
    image.src = url;
}

// Matter.js で円を作成してテクスチャを設定する関数
function createTexturedCircle(mouseX, mouseY, radius, textureUrl) {
    loadImageAndResize(textureUrl, radius * 2, radius * 2, function (resizedUrl) {
        // Matter.js の Body オブジェクトを作成
        const circle = Bodies.circle(mouseX, mouseY, radius, {
            render: {
                sprite: {
                    texture: resizedUrl
                }
            }
        });

        // Matter.js の世界に円を追加
        World.add(engine.world, circle);
    });
}



// function createTexturedCircle(x, y, radius) {
//     const circle = Bodies.circle(x, y, radius, {
//       render: {
//         sprite: {
//           texture: suika,
//         }
//       }
//     });

//     return circle;
//   }

//   const circle = createTexturedCircle(200, 200, 50);




// 衝突イベントをリッスン
Events.on(engine, 'collisionStart', function (event) {
    const pairs = event.pairs;

    pairs.forEach(function (pair) {
        if (pair.bodyA === ground || pair.bodyB === ground) {
            updateCounter();
        }
    });
});



const modal = document.getElementById('myModal');
const closeModal = document.getElementsByClassName('close')[0];
const recordText = document.getElementById('record');


// モーダルを閉じる
closeModal.onclick = function () {
    modal.style.display = "none";
    location.reload();

}

function checkCirclePositions() {
    world.bodies.forEach(function (body) {
        if (body.position.y > groundY) {
            World.remove(world, body);
            circleCount--;
            updateCounter();
            recordText.innerHTML = `<br>個数: ${(circleCount).toString()}<br>ポイント: ${pointCount}<br>`;
            modal.style.display = "block";
            console.log('終わり')
        }
    });
}


// マウス制約を追加（デバッグ用）
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false,
        },
    },
});
World.add(world, mouseConstraint);
setInterval(checkCirclePositions, 100);
// レンダラのマウスを更新
render.mouse = mouse;
