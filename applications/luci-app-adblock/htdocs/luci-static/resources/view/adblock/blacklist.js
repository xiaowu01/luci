'use strict';
'require fs';
'require ui';

return L.view.extend({
	load: function() {
		return L.resolveDefault(fs.read_direct('/etc/adblock/adblock.blacklist'), '');
	},
	handleSave: function(ev) {
		var value = ((document.querySelector('textarea').value || '').trim().toLowerCase().replace(/\r\n/g, '\n').replace(/[^a-z0-9\.\-\#\n]/g, '')) + '\n';
		return fs.write('/etc/adblock/adblock.blacklist', value)
			.then(function(rc) {
				document.querySelector('textarea').value = value;
				ui.addNotification(null, E('p', _('Blacklist changes have been saved. Refresh your adblock lists that changes take effect.')), 'info');
			}).catch(function(e) {
				ui.addNotification(null, E('p', _('Unable to save changes: %s').format(e.message)));
			});
	},
	render: function(blacklist) {
		return E([
			E('p', {},
				_('This is the local adblock blacklist to always-deny certain (sub) domains.<br /> \
				Please note: add only one domain per line. Comments introduced with \'#\' are allowed - ip addresses, wildcards and regex are not.')),
			E('p', {},
				E('textarea', {
					'style': 'width: 100% !important; padding: 5px; font-family: monospace',
					'spellcheck': 'false',
					'wrap': 'off',
					'rows': 25
				}, [ blacklist != null ? blacklist : '' ])
			)
		]);
	},
	handleSaveApply: null,
	handleReset: null
});
