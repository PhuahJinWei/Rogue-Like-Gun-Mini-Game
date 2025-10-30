(function attachGlobalErrorLogging() {
	function log(msg) {
		try { console.error(msg); } catch (_) {}
		let el = document.getElementById('error-overlay');
		if (!el) {
			el = document.createElement('pre');
			el.id = 'error-overlay';
			el.textContent = '▶ Error Log\n';
			Object.assign(el.style, {
				position: 'fixed', left: 0, right: 0, bottom: 0,
				maxHeight: '40vh', overflow: 'auto',
				background: 'rgba(0,0,0,.85)', color: '#fff',
				padding: '8px', margin: 0, font: '12px/1.4 monospace',
				zIndex: 2147483647, whiteSpace: 'pre-wrap'
			});
			(document.body ? Promise.resolve() : new Promise(r => addEventListener('DOMContentLoaded', r)))
			.then(() => document.body.appendChild(el));
		}
		el.textContent += (el.textContent.endsWith('\n') ? '' : '\n') + msg + '\n';
	}
	function fmt(ev) {
		const err = ev.error ?? ev.reason;
		if (err && err.stack) return err.stack;
		return (ev.message || String(err || 'Unknown error'));
	}

	addEventListener('error', (ev) => {log('❌ ' + fmt(ev));}, true);
	addEventListener('unhandledrejection', (ev) => {log('💥 Unhandled rejection: ' + fmt(ev));}, true);

	window.onerror = function (message, source, lineno, colno, error) {
		log(`❌ ${message} @ ${source || '<inline>'}:${lineno || 0}:${colno || 0}` +
		(error && error.stack ? `\n${error.stack}` : ''));
		return false;
	};
})();