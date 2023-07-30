/**
 * @name FreeEmojis
 * @version 1.7.111111111111
 * @description Link emojis if you don't have nitro! Type them out or use the emoji picker! [Split]
 * @author An0
 * @source https://github.com/An00nymushun/DiscordFreeEmojis
 */

var FreeEmojis = (() => {

    'use strict';
    
    const UrlBase = "https://cdn.discordapp.com/emojis/";
    const DelayBetweenSplit = 300;
    const MaxDelay = 5000;
    const BaseColor = "#0cf";
    
    var Discord;
    var Utils = {
        Log: (message) => { console.log(`%c[FreeEmojis] %c${message}`, `color:${BaseColor};font-weight:bold`, "") },
        Warn: (message) => { console.warn(`%c[FreeEmojis] %c${message}`, `color:${BaseColor};font-weight:bold`, "") },
        Error: (message) => { console.error(`%c[FreeEmojis] %c${message}`, `color:${BaseColor};font-weight:bold`, "") },
        Webpack: () => {
            let webpackExports;
    
            if(typeof BdApi !== "undefined" && BdApi?.findModuleByProps && BdApi?.findModule) {
                return { findModule: BdApi.findModule, findModuleByUniqueProperties: (props) => BdApi.findModuleByProps.apply(null, props) };
            }
            else if(Discord.window.webpackChunkdiscord_app != null) {
                Discord.window.webpackChunkdiscord_app.push([
                    ['__extra_id__'],
                    {},
                    req => webpackExports = req
                ]);
            }
            else if(Discord.window.webpackJsonp != null) {
                webpackExports = typeof(Discord.window.webpackJsonp) === 'function' ?
                Discord.window.webpackJsonp(
                    [],
                    { '__extra_id__': (module, _export_, req) => { _export_.default = req } },
                    [ '__extra_id__' ]
                ).default :
                Discord.window.webpackJsonp.push([
                    [],
                    { '__extra_id__': (_module_, exports, req) => { _module_.exports = req } },
                    [ [ '__extra_id__' ] ]
                ]);
            }
            else return null;
        
            delete webpackExports.m['__extra_id__'];
            delete webpackExports.c['__extra_id__'];
        
            const findModule = (filter) => {
                for(let i in webpackExports.c) {
                    if(webpackExports.c.hasOwnProperty(i)) {
                        let m = webpackExports.c[i].exports;
        
                        if(!m) continue;
        
                        if(m.__esModule && m.default) m = m.default;
        
                        if(filter(m)) return m;
                    }
                }
        
                return null;
            };
    
            const findModuleByUniqueProperties = (propNames) => findModule(module => propNames.every(prop => module[prop] !== undefined));
    
            return { findModule, findModuleByUniqueProperties };
        }
    };
    
    var Initialized = false;
    var searchHook;
    var parseHook;
    var getEmojiUnavailableReasonHook;
    var enqueueHook;
    function Init()
    {
        Discord = { window: (typeof(unsafeWindow) !== 'undefined') ? unsafeWindow : window };
    
        const webpackUtil = Utils.Webpack();
        if(webpackUtil == null) { Utils.Error("Webpack not found."); return 0; }
        const { findModuleByUniqueProperties } = webpackUtil;
    
        let emojisModule = findModuleByUniqueProperties([ 'getDisambiguatedEmojiContext', 'searchWithoutFetchingLatest' ]);
        if(emojisModule == null) { Utils.Error("emojisModule not found."); return 0; }
    
        let messageEmojiParserModule = findModuleByUniqueProperties([ 'parse', 'parsePreprocessor', 'unparse' ]);
        if(messageEmojiParserModule == null) { Utils.Error("messageEmojiParserModule not found."); return 0; }
    
        let emojiPermissionsModule = findModuleByUniqueProperties([ 'getEmojiUnavailableReason' ]);
        if(emojiPermissionsModule == null) { Utils.Error("emojiPermissionsModule not found."); return 0; }
    
        let channelCacheModule = findModuleByUniqueProperties( [ 'getChannel', 'getDMFromUserId' ]);
        if(channelCacheModule == null) Utils.Warn("channelCacheModule not found.");
    
        let messageQueueModule = findModuleByUniqueProperties( [ 'enqueue', 'handleSend', 'handleEdit' ]);
        if(messageQueueModule == null) Utils.Warn("messageQueueModule not found.");
    
        searchHook = Discord.original_searchWithoutFetchingLatest = emojisModule.searchWithoutFetchingLatest;
        emojisModule.searchWithoutFetchingLatest = function() { return searchHook.apply(this, arguments); };
    
        parseHook = Discord.original_parse = messageEmojiParserModule.parse;
        messageEmojiParserModule.parse = function() { return parseHook.apply(this, arguments); };
    
        getEmojiUnavailableReasonHook = Discord.original_getEmojiUnavailableReason = emojiPermissionsModule.getEmojiUnavailableReason;
        emojiPermissionsModule.getEmojiUnavailableReason = function() { return getEmojiUnavailableReasonHook.apply(this, arguments); };
    
        if(messageQueueModule != null && channelCacheModule != null) {
            Discord.MessageQueue = messageQueueModule;
            Discord.ChannelCache = channelCacheModule;
            enqueueHook = Discord.original_enqueue = messageQueueModule.enqueue;
            messageQueueModule.enqueue = function() { return enqueueHook.apply(this, arguments); };
        }
    
        Utils.Log("initialized");
        Initialized = true;
    
        return 1;
    };
    
    function Start() {
        if(!Initialized && Init() !== 1) return;
    
        const { original_parse, original_getEmojiUnavailableReason } = Discord;
    
        searchHook = function() {
            let result = Discord.original_searchWithoutFetchingLatest.apply(this, arguments);
    
            result.unlocked.push(...result.locked);
            result.locked = [];
            return result;
        }
    
        function replaceEmoji(parseResult, emoji) {
            let sliceIndex = -5;
            let currentEmojiFormat = ".png"
            if (emoji.url.split("?")[0].slice(sliceIndex, sliceIndex + 1) != ".") {
                sliceIndex = -4;
                currentEmojiFormat = ".gif"
            }
            parseResult.content = parseResult.content.replace(`<${emoji.animated ? "a" : ""}:${emoji.originalName || emoji.name}:${emoji.id}>`, emoji.url.split("?")[0].slice(0, sliceIndex) + currentEmojiFormat + "?size=48&quality=lossless");
        }
    
        parseHook = function() {
            let result = original_parse.apply(this, arguments);
    
            if(result.invalidEmojis.length !== 0) {
                for(let emoji of result.invalidEmojis) {
                    replaceEmoji(result, emoji);
                }
                result.invalidEmojis = [];
            }
            let validNonShortcutEmojis = result.validNonShortcutEmojis;
            for (let i = 0; i < validNonShortcutEmojis.length; i++) {
                const emoji = validNonShortcutEmojis[i];
                if(!emoji.available) {
                    replaceEmoji(result, emoji);
                    validNonShortcutEmojis.splice(i, 1);
                    i--;
                }
            }
    
            return result;
        };
    
        getEmojiUnavailableReasonHook = function() {
            return null;
        }
        
    
        if(enqueueHook) {
            const { MessageQueue, ChannelCache, original_enqueue } = Discord;
            const escapedUrlBase = UrlBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const emojiLinkRegex = new RegExp(`^\\s*((?:${escapedUrlBase}[^\\s]+\\s*)+)?(.*?)((?:${escapedUrlBase}[^\\s]+\\s*)+)?\\s*$`, "s");
            const sendMessage = (message, originalCallback, callback) => {
                if(message.nonce == null) message.nonce = (BigInt(Date.now() - 14200704e5/*DISCORD_EPOCH*/) << 22n).toString();
    
                original_enqueue.call(MessageQueue, { type: 0/*send*/, message }, function() {
                    originalCallback.apply(this, arguments);
                    callback();
                });
            };
            enqueueHook = function(packet, callback) {
                if(packet.type === 0/*send*/) {
                    const message = packet.message;
                    const content = message.content;
                    let match = emojiLinkRegex.exec(content);
                    let newContent = match[2].trim();
                    if(newContent !== "" && (match[3] || match[1])) {
                        let emojiBefore = match[1];
                        let emojiAfter = match[3];
                        let channelId = message.channelId;
                        let channel = ChannelCache.getChannel(channelId);
    
                        let rateLimit = channel.rateLimitPerUser * 1000;
                        if(rateLimit <= MaxDelay) {
                            let delay = Math.max(DelayBetweenSplit, rateLimit);
                            message.content = newContent;
    
                            let messages = [message];
                            if(emojiBefore) {
                                messages.unshift({ channelId, content: emojiBefore, nonce: message.nonce });
                                message.nonce = null;
                            }
                            if(emojiAfter) messages.push({ channelId, content: emojiAfter });
    
                            messages = messages.values();
                            let currMessage = messages.next().value;
                            const nextMessage = () => {
                                sendMessage(currMessage, callback, () => {
                                    currMessage = messages.next().value;
                                    if(currMessage !== undefined) setTimeout(nextMessage, delay);
                                });
                            };
                            nextMessage();
    
                            return;
                        }
                    }
                }
    
                original_enqueue.apply(this, arguments);
            };
        }
    };
    
    function Stop() {
        if(!Initialized) return;
    
        searchHook = Discord.original_searchWithoutFetchingLatest;
        parseHook = Discord.original_parse;
        getEmojiUnavailableReasonHook = Discord.original_getEmojiUnavailableReason;
        if(enqueueHook) enqueueHook = Discord.original_enqueue;
    };
    
    return function() { return {
        start: Start,
        getName: () => "DiscordFreeEmojis48Split",
        getShortName: () => "FreeEmojis",
        getDescription: () => "Link emojis if you don't have nitro! Type them out or use the emoji picker! [64px]",
        getVersion: () => "1.7",
        getAuthor: () => "An0",
        stop: Stop
    }};
    
    })();
    
    module.exports = FreeEmojis;
    
    /*@end @*/