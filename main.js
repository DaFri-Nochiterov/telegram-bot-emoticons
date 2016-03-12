var tgbot = require('node-telegram-bot-api');

var bot = new tgbot(your_token, { polling: { timeout: 2000, interval: 500 }});
var emoticons = require('./emoticons.js');

String.prototype.startsWith = function (str)
{
 return this.indexOf(str) == 0;
}

String.prototype.includes = function (str)
{
 return this.indexOf(str) != -1;
}

bot.on('inline_query', function(q){
	try{
		var mode = 'right';
		var name = null;
		if(q.query.startsWith('?n:')){
			name = q.query.slice(4);
			q.query = '';
		} else {
			if(q.from.first_name){
				name = q.from.first_name;
			}
			if(q.from.last_name){
				name += ' ' + q.from.last_name;
			}
		}
		if(q.offset){
			var offset = parseInt(q.offset);
		} else { offset = 0; }
		if(q.query.startsWith('?l ')){
			mode = 'left';
			q.query = q.query.slice(3);
		} else if(q.query.startsWith('?r ')){
			mode = 'right';
			q.query = q.query.slice(3);
		}
		try{
			var result = [];
			emoticons.slice(offset, offset + 20).map(function(el, index, array) {
				var text = '';
				if(el.includes('{name}')){
					el = el.replace('{name}', name);
				}
				if(mode == 'left'){
					text = q.query + ' ' + el;
				} else if(mode == 'right'){
					text = el + ' ' + q.query;
				}
				var temp = {
					type: 'article',
					title: el + '',
					id: index + '#',
					message_text:  text,
					description: text
				};
				if(temp.description == el + ' ' || temp.description == ' ' + el){
					temp.description = undefined;
				}
				result.push(temp);
			});
			bot.answerInlineQuery(q.id, result, {
				next_offset: offset + 20 + '',
				cache_time: 3600
			});
		}
		catch(err){
			console.error(err);
		}
	} catch(error){
		console.warn(error);
	}
});
