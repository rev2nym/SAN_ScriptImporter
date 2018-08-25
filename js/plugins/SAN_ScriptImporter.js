//=============================================================================
// SAN_ScriptImporter.js
//=============================================================================
// Copyright (c) 2018 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================
// GitHub  : https://github.com/rev2nym
// Twitter : https://twitter.com/rev2nym
//=============================================================================

/*:
 * @plugindesc スクリプトインポーター 1.0.0
 * プラグインやスクリプトの前提スクリプトを読み込みます。
 * @author サンシロ https://twitter.com/rev2nym
 * @help
 * ■概要
 * プラグインやスクリプトの前提スクリプトを読み込みます。
 * jsファイルに次のように記述してください。
 * 
 * (function() {
 * 'use strict';
 * 
 * var imports = [
 *     // 前提スクリプトのファイルパスリスト
 * ];
 * 
 * var body = function() {
 *     // スクリプトの本文
 * };
 * 
 * ScriptImporter.add(imports, body);
 * })();
 * 
 * ■利用規約
 * MITライセンスのもと、商用利用、改変、再配布が可能です。
 * ただし冒頭のコメントは削除や改変をしないでください。
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 */

var Imported = Imported || {};
Imported.SAN_ScriptImporter = true;

var Sanshiro = Sanshiro || {};
Sanshiro.ScriptImporter = Sanshiro.ScriptImporter || {};
Sanshiro.ScriptImporter.version = '1.0.0';

(function() {
'use strict';

//-----------------------------------------------------------------------------
// ScriptImporter
// 
// スクリプトインポーター

window.ScriptImporter = function ScriptImporter() {
    throw new Error('This is a static class');
}

ScriptImporter._importedBodies = [];
ScriptImporter._importedUrls = [];
ScriptImporter._errorUrls = [];

// スクリプトの追加
ScriptImporter.add = function(imports, body) {
    this.addImportedBody(body);
    this.addImportedUrls(imports);
};

// 導入スクリプト内容の追加
ScriptImporter.addImportedBody = function(body) {
    this._importedBodies.unshift(body)
};

// 導入スクリプトURLの追加
ScriptImporter.addImportedUrl = function(url) {
    this._importedUrls.unshift(url);
    this.loadScript(url);
};

// 導入スクリプトURLリストの追加
ScriptImporter.addImportedUrls = function(imports) {
    imports.forEach(
        function(url){
            if (!this.isImportedUrl(url)) {
                this.addImportedUrl(url);
            }
        }, this
    );
};

// 導入済URL判定
ScriptImporter.isImportedUrl = function(url) {
    var index = this._importedUrls.indexOf(url);
    return index !== -1;
};

// スクリプトのロード
ScriptImporter.loadScript = function(url) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script.onerror = this.onError.bind(this);
    script._url = url;
    document.body.appendChild(script);
};

// スクリプトの適用
ScriptImporter.applyScripts = function() {
    this._importedBodies.forEach(
        function(body) {
            body();
        }
    );
};

// エラーハンドラ
ScriptImporter.onError = function(e) {
    this._errorUrls.push(e.target._url);
};

// エラーチェック
ScriptImporter.checkErrors = function() {
    var url = this._errorUrls.shift();
    if (url) {
        throw new Error('Failed to load: ' + url);
    }
};

//-----------------------------------------------------------------------------
// SceneManager
// 
// シーンマネージャ

// プラグインエラーチェック
var _SceneManager_checkPluginErrors = SceneManager.checkPluginErrors;
SceneManager.checkPluginErrors = function() {
    _SceneManager_checkPluginErrors.call(this);
    ScriptImporter.checkErrors();
};

//-----------------------------------------------------------------------------
// main
// 
// メインスクリプト

// ロードハンドラ
var _window_onload = window.onload;
window.onload = function() {
    ScriptImporter.applyScripts();
    _window_onload.call(this);
};

})();
