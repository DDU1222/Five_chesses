
var view = {
	Init: function () {
		this._w_steps = [];
		this._b_steps = [];
		this._canvasWidth = 600;
		this._canvasHeight = 600;
		this._cellWidth = 25;
		this._cellHeight = 25;
		this._piece_r = 12;
		this._container = document.querySelector('.root');
		this._renderer = PIXI.autoDetectRenderer(this._canvasWidth, this._canvasHeight, { antialias: true });
		this._container.appendChild(this._renderer.view);
		this._stage = new PIXI.Container();
		this._stage.interactive = true;
		this._pieceCount = 0;
		this._over = false;

		this.createCanvas();
		this.bindEvent();
	},
	createCanvas: function() {
		//画棋盘
		var graphics = new PIXI.Graphics();
		graphics.lineStyle(0.5, 0x000000, 1);
		var current_width = Math.floor(this._canvasWidth / this._cellWidth);
		var current_height = Math.floor(this._canvasHeight / this._cellHeight);
 
		for (var i = 0; i <= current_width; i++) {
			for (var j = 0; j <= current_height; j++) {
				graphics.beginFill(0x71FFCB, 1);
				graphics.lineStyle(0.5, 0x000000, 1);
				graphics.drawRect(i * this._cellWidth, j * this._cellHeight, this._cellWidth, this._cellHeight);
			}
		}
		
		this._stage.addChild(graphics);
		this._renderer.render(this._stage);
	},
	step: function (event) {
		if (this._over) {
			return;
		}
		var e = event.data.originalEvent;
		var w = Math.round(e.offsetX / this._cellWidth) * this._cellWidth;
		var h = Math.round(e.offsetY / this._cellHeight) * this._cellHeight;
		var op = this._w_steps.concat(this._b_steps).some(function(e, i){
			return (e.width === w && e.height === h);
		});
		if (op) {return;}
		var n = this._pieceCount % 2;
		if (n) {
			this._w_steps.push({"width": w , "height": h});
		} else {
			this._b_steps.push({"width": w , "height": h});
		}
		this.createPiece(n, w, h);
	},
	//是否包含数组方法
	isContained: function (a, b) {
		if(!(a instanceof Array) || !(b instanceof Array)) return false;
		if(a.length < b.length) return false;
		return b.every(function(e) { 
			return a.some(function(m) {
				return m.width == e.width && m.height == e.height;
			});
		});
	},
	//判断八种组合方式
	judgeResult: function (n, w, h) {
		var _this = this;
		//0 黑子 1 白子
		if (typeof n != 'number') {
			return;
		}
		console.log(w, h, n);
		var isExistCurrentArray = _this.createWinOption(w, h).some(function (e) {
			var currentArr = n ? _this._w_steps : _this._b_steps;
			return _this.isContained(currentArr, e);
		});
		if (isExistCurrentArray) {
			_this._over = true;
			setTimeout(function () {
				alert(n ? '白棋赢！！！' : '黑棋赢！！！');
			}, 200);
		}
	},
	// 定义一个所有胜利情况的数组
	createWinOption: function (w, h) {
		var arr = [];
		// 共八个方向四条线20种情况
		for (var i = 1; i <= 5; i++) {
			for (var k = 1; k <= 4; k++) {
				arr.push(this.countPieceLocation(w, h, i, k));
			}
		}
		return arr;
	},
	countPieceLocation: function (w, h, c, k) {
		var arr = [];
		for (var i = (c - 5); i < c; i++) {
			switch(k) {
				// y轴
				case 1: 
					arr.push({width: w, height: h + this._cellHeight * i});
				break;
				// x轴
				case 2: 
					arr.push({width: w + this._cellWidth * i, height: h});
				break;
				// 一三象限对角线
				case 3: 
					arr.push({width: w + this._cellWidth * i, height: h + this._cellHeight * i});
				break;
				// 二四象限对角线
				case 4: 
					arr.push({width: w + this._cellWidth * i, height: h + this._cellHeight * -i});
				break;
			}
		}
		return arr;
	},
	createPiece: function (n, x , y) {
		//0 黑子 1 白子
		if (typeof n != 'number') {
			return;
		}
		this._pieceCount ++;
		//画棋子
		var piece = new PIXI.Graphics();
		piece.lineStyle(0);
		piece.beginFill(n ? 0xFFFFFF : 0x000000, 1);
		piece.drawCircle(x, y, this._piece_r);
		piece.endFill();
		piece.interactive = true;

		this._stage.addChild(piece);
		this._renderer.render(this._stage);
		// 画出棋子后判断输赢
		if (this._pieceCount > 8) {
			this.judgeResult(n, x, y);
		}
	},
	bindEvent: function () {
		this._stage.on('tap', this.step.bind(this));
		this._stage.on('click', this.step.bind(this));
	}
}
view.Init();	
