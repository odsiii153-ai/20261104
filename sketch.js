let stopSprite; // 儲存站立動畫的精靈圖。
let walkSprite; // 儲存行走動畫的精靈圖。
let runSprite; // 儲存跑步動畫的精靈圖。
let runLeftSprite; // 儲存左向跑步動畫的精靈圖。
let runRightSprite; // 儲存右向跑步動畫的精靈圖。
let jumpSprite; // 儲存跳躍動畫的精靈圖。
let trees = []; // 儲存森林中固定位置的樹木資料。
let fireflies = []; // 儲存背景螢火蟲的動畫資料。
let characterX; // 儲存角色目前的水平位置。
let facing = 1; // 設定角色初始朝向右方。
let isJumping = false; // 記錄跳躍動畫是否正在播放。
let jumpStartedAt = 0; // 記錄本次跳躍動畫的開始時間。
let upKeyHeld = false; // 記錄上方向鍵是否尚未放開。
const characterHeight = 190; // 設定角色在畫面上的顯示高度。
const jumpFrameDuration = 90; // 設定跳躍動畫每格影格的播放時間。
const spriteSheets = { // 定義各精靈圖的每格數量與原始尺寸。
  stop: { frames: 16, width: 779, height: 95 }, // 設定站立動畫的精靈圖規格。
  walk: { frames: 10, width: 545, height: 92 }, // 設定行走動畫的精靈圖規格。
  runLeft: { frames: 4, width: 271, height: 86 }, // 設定左向跑步動畫的精靈圖規格。
  runRight: { frames: 8, width: 595, height: 91 }, // 設定右向跑步動畫的精靈圖規格。
  jump: { frames: 9, width: 580, height: 98 } // 設定跳躍動畫的精靈圖規格。
}; // 結束精靈圖規格設定。

function preload() { // 在畫布開始繪製前載入角色精靈圖。
  stopSprite = loadImage('1/stop/stop.png'); // 載入站立精靈圖。
  walkSprite = loadImage('1/walk/walk.png'); // 載入行走精靈圖。
  runLeftSprite = loadImage('1/run/run_左.png'); // 載入左向跑步精靈圖。
  runRightSprite = loadImage('1/run/run_右.png'); // 載入右向跑步精靈圖。
  jumpSprite = loadImage('1/jump/jump.png'); // 載入跳躍精靈圖。
} // 結束載入函式。

function setup() { // 初始化全螢幕畫布與場景資料。
  createCanvas(windowWidth, windowHeight); // 建立符合瀏覽器視窗大小的畫布。
  imageMode(CORNER); // 使用圖片左上角作為繪製定位基準。
  characterX = width / 2; // 將角色初始位置放在畫面水平中央。
  createForest(); // 建立樹木與螢火蟲的隨機場景資料。
} // 結束初始化函式。

function draw() { // 每個動畫影格重繪森林與角色。
  drawForest(); // 繪製會動態變化的精靈森林背景。
  updateCharacter(); // 讀取方向鍵並更新角色位置與朝向。
  drawCharacter(); // 依照目前狀態繪製角色動畫影格。
} // 結束每影格繪製函式。

function createForest() { // 依畫面尺寸建立背景物件。
  trees = []; // 清除舊樹木，避免視窗縮放後資料累積。
  fireflies = []; // 清除舊螢火蟲，重新配置背景位置。
  randomSeed(24); // 固定隨機種子，讓森林配置穩定一致。
  for (let layer = 0; layer < 3; layer += 1) { // 建立遠、中、近三層森林。
    const count = Math.ceil(width / (90 + layer * 45)) + 2; // 依畫面寬度計算每層樹木數量。
    for (let index = 0; index < count; index += 1) { // 逐一建立目前層的樹木資料。
      trees.push({ x: (index / (count - 1)) * width + random(-35, 35), layer, seed: random(1000), size: random(0.75, 1.25) }); // 儲存樹木位置、景深、枝葉種子與比例。
    } // 結束目前層的樹木建立。
  } // 結束三層森林建立。
  for (let index = 0; index < 38; index += 1) { // 建立背景中的螢火蟲。
    fireflies.push({ x: random(width), y: random(height * 0.3, height * 0.88), phase: random(TWO_PI), size: random(2, 5) }); // 儲存螢火蟲位置、閃爍相位與大小。
  } // 結束螢火蟲建立。
} // 結束場景資料建立函式。

function drawForest() { // 繪製夜色森林以及持續閃爍的氛圍效果。
  background(8, 18, 30); // 以深藍色清除上一個動畫影格。
  noStroke(); // 關閉形狀外框以呈現柔和景物。
  for (let band = 0; band < 8; band += 1) { // 逐段繪製由上而下的夜空漸層。
    fill(9 + band * 2, 22 + band * 4, 39 + band * 3); // 設定每一段漸層的夜空顏色。
    rect(0, (height / 8) * band, width, height / 8 + 1); // 填滿目前的夜空漸層區域。
  } // 結束夜空漸層繪製。
  fill(211, 226, 205, 24); // 設定月光暈染的半透明顏色。
  ellipse(width * 0.78, height * 0.2, min(width, height) * 0.38); // 繪製柔和的月光光暈。
  fill(233, 239, 211); // 設定月亮本體的淡黃色。
  ellipse(width * 0.78, height * 0.2, min(width, height) * 0.12); // 在右上方繪製月亮。
  fill(214, 230, 224, 185); // 設定星點的柔和亮色。
  for (let index = 0; index < 65; index += 1) { // 逐點繪製遠方星空。
    const x = (index * 197 + 41) % width; // 以固定間距計算星點水平位置。
    const y = (index * 83 + 17) % max(1, floor(height * 0.58)); // 將星點限制在天空範圍內。
    const twinkle = 1 + (sin(frameCount * 0.035 + index) + 1) * 1.2; // 計算每顆星星的閃爍大小。
    ellipse(x, y, twinkle, twinkle); // 繪製目前大小的星點。
  } // 結束星空繪製。
  fill(16, 40, 48, 150); // 設定遠景山巒的深青色。
  ellipse(width * 0.18, height * 0.78, width * 0.9, height * 0.58); // 繪製左側遠方山巒。
  ellipse(width * 0.82, height * 0.78, width * 1.05, height * 0.62); // 繪製右側遠方山巒。
  for (const tree of trees) { // 逐棵繪製森林樹木。
    drawTree(tree); // 繪製一棵包含樹幹與樹冠的樹。
  } // 結束樹木繪製。
  fill(13, 30, 25, 235); // 設定森林地面顏色。
  rect(0, height * 0.78, width, height * 0.22); // 繪製覆蓋畫面底部的森林地面。
  for (let index = 0; index < 22; index += 1) { // 繪製地面的發光草叢。
    const x = (index * 113 + 27) % width; // 計算每叢草的位置。
    const sway = sin(frameCount * 0.04 + index) * 5; // 計算草叢隨風搖擺幅度。
    stroke(70, 127, 82, 110); // 設定草葉半透明綠色線條。
    strokeWeight(2); // 設定草葉線條粗細。
    line(x, height * 0.8, x - 8 + sway, height * 0.8 - 19); // 繪製草叢左側葉片。
    line(x, height * 0.8, x + 7 + sway, height * 0.8 - 24); // 繪製草叢右側葉片。
  } // 結束草叢繪製。
  noStroke(); // 關閉螢火蟲繪製的外框。
  for (const light of fireflies) { // 逐一更新並繪製螢火蟲。
    const glow = (sin(frameCount * 0.06 + light.phase) + 1) / 2; // 計算螢火蟲的呼吸式亮度。
    const driftX = sin(frameCount * 0.012 + light.phase) * 14; // 計算螢火蟲緩慢水平漂移。
    const driftY = cos(frameCount * 0.018 + light.phase) * 9; // 計算螢火蟲緩慢垂直漂移。
    fill(174, 245, 137, 25 + glow * 55); // 設定螢火蟲外層光暈顏色。
    ellipse(light.x + driftX, light.y + driftY, light.size * 5, light.size * 5); // 繪製螢火蟲柔和光暈。
    fill(221, 255, 170, 100 + glow * 155); // 設定螢火蟲中心的亮點顏色。
    ellipse(light.x + driftX, light.y + driftY, light.size, light.size); // 繪製螢火蟲發光中心。
  } // 結束螢火蟲繪製。
} // 結束森林背景繪製函式。

function drawTree(tree) { // 依照樹木景深繪製不同大小與明暗的樹。
  const depth = tree.layer; // 取得樹木所在的遠中近景層級。
  const scaleFactor = (0.62 + depth * 0.34) * tree.size; // 依景深與隨機比例計算樹木大小。
  const groundY = height * (0.73 + depth * 0.055); // 依景深計算樹木的地面位置。
  const trunkHeight = height * 0.31 * scaleFactor; // 計算樹幹高度。
  const trunkWidth = (13 + depth * 7) * scaleFactor; // 計算樹幹寬度。
  const canopyColor = color(20 + depth * 5, 65 + depth * 9, 61 + depth * 5, 230); // 依景深設定樹冠顏色。
  noStroke(); // 移除樹冠與樹幹外框。
  fill(25 + depth * 5, 38 + depth * 3, 34, 235); // 設定樹幹的深色。
  rect(tree.x - trunkWidth / 2, groundY - trunkHeight, trunkWidth, trunkHeight); // 繪製直立樹幹。
  fill(canopyColor); // 套用目前樹木的葉冠顏色。
  for (let branch = 0; branch < 4; branch += 1) { // 由下而上繪製四層樹冠。
    const branchY = groundY - trunkHeight + branch * trunkHeight * 0.2; // 計算目前樹冠層高度。
    const branchWidth = trunkHeight * (0.9 - branch * 0.16); // 計算目前樹冠層寬度。
    const wobble = sin(frameCount * 0.025 + tree.seed + branch) * 3; // 計算樹冠隨風擺動幅度。
    triangle(tree.x - branchWidth / 2 + wobble, branchY + trunkHeight * 0.25, tree.x + branchWidth / 2 + wobble, branchY + trunkHeight * 0.25, tree.x + wobble, branchY - trunkHeight * 0.25); // 繪製目前層的尖形樹冠。
  } // 結束樹冠層繪製。
} // 結束單棵樹木繪製函式。

function updateCharacter() { // 依照鍵盤方向計算角色動作與位移。
  const movingLeft = keyIsDown(LEFT_ARROW); // 檢查左方向鍵是否按住。
  const movingRight = keyIsDown(RIGHT_ARROW); // 檢查右方向鍵是否按住。
  const running = keyIsDown(32) && (movingLeft || movingRight); // 只有空白鍵與方向鍵同按時啟用跑步。
  if (movingLeft !== movingRight) { // 僅在單一方向鍵按下時移動角色。
    const direction = movingLeft ? -1 : 1; // 依照按鍵方向決定移動正負方向。
    facing = direction; // 使角色面向目前移動方向。
    characterX += direction * (running ? 300 : 165) * deltaTime / 1000; // 依照走路或跑步速度更新位置。
  } // 結束角色移動判斷。
  const currentSheet = isJumping ? spriteSheets.jump : running ? movingLeft ? spriteSheets.runLeft : spriteSheets.runRight : movingLeft || movingRight ? spriteSheets.walk : spriteSheets.stop; // 選擇目前動畫的影格規格。
  const frameWidth = currentSheet.width / currentSheet.frames; // 計算精靈圖中單格影格的原始寬度。
  const displayWidth = frameWidth * characterHeight / currentSheet.height; // 依照固定顯示高度計算角色寬度。
  characterX = constrain(characterX, displayWidth / 2, width - displayWidth / 2); // 避免角色移動出畫面左右邊界。
} // 結束角色更新函式。

function drawCharacter() { // 繪製目前動作狀態中的角色動畫。
  const moving = keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW); // 判斷目前是否按住左右方向鍵。
  const running = keyIsDown(32) && moving; // 判斷目前是否正在跑步。
  const movingLeft = keyIsDown(LEFT_ARROW); // 判斷目前是否按住左方向鍵。
  const movingRight = keyIsDown(RIGHT_ARROW); // 判斷目前是否按住右方向鍵。
  const jumpElapsed = millis() - jumpStartedAt; // 計算本次跳躍動畫已播放的時間。
  const jumpPlaying = isJumping && jumpElapsed < spriteSheets.jump.frames * jumpFrameDuration; // 確認跳躍動畫是否尚未完整播放一輪。
  if (isJumping && !jumpPlaying) { // 在跳躍動畫播完後結束跳躍狀態。
    isJumping = false; // 讓角色恢復一般動作動畫。
  } // 結束跳躍動畫完成處理。
  const jumpProgress = jumpPlaying ? constrain(jumpElapsed / (spriteSheets.jump.frames * jumpFrameDuration), 0, 1) : 0; // 計算跳躍動畫目前完成的比例。
  const jumpArc = sin(PI * jumpProgress); // 使用弧線讓角色平順地上升並落回地面。
  const jumpOffset = jumpArc * characterHeight * 0.9; // 依弧線計算角色向上的跳躍高度。
  const currentSprite = jumpPlaying ? jumpSprite : running ? movingLeft ? runLeftSprite : runRightSprite : moving ? walkSprite : stopSprite; // 優先選擇跳躍精靈圖，否則選擇一般動作圖。
  const currentSheet = jumpPlaying ? spriteSheets.jump : running ? movingLeft ? spriteSheets.runLeft : spriteSheets.runRight : moving ? spriteSheets.walk : spriteSheets.stop; // 取得目前精靈圖的影格規格。
  const frameWidth = currentSheet.width / currentSheet.frames; // 計算精靈圖每格的原始寬度。
  const frameIndex = jumpPlaying ? floor(jumpElapsed / jumpFrameDuration) : floor(millis() / (running ? 65 : 90)) % currentSheet.frames; // 跳躍播放單輪影格，其餘動作則循環播放。
  const frameHeight = currentSheet.height; // 取得目前影格的原始高度。
  const displayWidth = frameWidth * characterHeight / frameHeight; // 按照原始比例計算角色顯示寬度。
  if (jumpPlaying) { // 角色跳躍時在地面繪製跟隨高度變化的影子。
    noStroke(); // 關閉影子的外框。
    fill(0, 0, 0, 70 - jumpArc * 40); // 角色越高時讓地面影子越淡。
    ellipse(characterX, height * 0.68 + characterHeight * 0.48, displayWidth * (0.62 - jumpArc * 0.2), characterHeight * 0.1); // 隨角色高度縮小地面影子以強化騰空感。
  } // 結束地面影子繪製。
  push(); // 儲存繪圖狀態以隔離角色的方向翻轉。
  translate(characterX, height * 0.68 - jumpOffset); // 依跳躍弧線將角色由地面向上移動再落回原位。
  scale(running ? 1 : facing, 1); // 只翻轉站立與行走精靈圖，跑步圖已按方向分開繪製。
  image(currentSprite, -displayWidth / 2, -characterHeight / 2, displayWidth, characterHeight, frameIndex * frameWidth, 0, frameWidth, frameHeight); // 從精靈圖裁切目前影格並繪製角色。
  pop(); // 還原繪圖狀態以免影響後續圖形。
} // 結束角色繪製函式。

function keyPressed() { // 在上方向鍵按下時啟動單次跳躍動畫。
  if (keyCode === UP_ARROW && !upKeyHeld) { // 只處理上方向鍵的新按下事件。
    upKeyHeld = true; // 標記上方向鍵已按住，避免長按重複觸發。
    if (!isJumping) { // 只有角色不在跳躍時才開始新的一輪動畫。
      isJumping = true; // 啟動跳躍動畫。
      jumpStartedAt = millis(); // 記錄跳躍動畫開始時間。
    } // 結束跳躍啟動判斷。
    return false; // 阻止上方向鍵造成頁面捲動。
  } // 結束上方向鍵處理。
} // 結束鍵盤按下處理函式。

function keyReleased() { // 在上方向鍵放開時允許下次跳躍。
  if (keyCode === UP_ARROW) { // 確認放開的是上方向鍵。
    upKeyHeld = false; // 清除按鍵狀態以允許下一次按下觸發跳躍。
    return false; // 阻止上方向鍵放開事件造成頁面捲動。
  } // 結束上方向鍵放開處理。
} // 結束鍵盤放開處理函式。

function windowResized() { // 在瀏覽器視窗大小改變時重新配置畫面。
  resizeCanvas(windowWidth, windowHeight); // 將畫布調整為新的視窗尺寸。
  characterX = constrain(characterX, 0, width); // 確保角色水平位置仍在新畫面範圍。
  createForest(); // 依新畫面尺寸重新建立森林場景資料。
} // 結束視窗縮放處理函式。
