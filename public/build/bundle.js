
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules\svelte-navigator\src\Router.svelte generated by Svelte v3.44.1 */

    const file$g = "node_modules\\svelte-navigator\\src\\Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$8(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$g, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$g, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$g($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(18, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$g,
    			create_fragment$g,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.44.1 */
    const file$f = "node_modules\\svelte-navigator\\src\\Route.svelte";

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block$7(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1$5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$5, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$f, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$f, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$f($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(15, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(16, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    /* node_modules\svelte-navigator\src\Link.svelte generated by Svelte v3.44.1 */
    const file$e = "node_modules\\svelte-navigator\\src\\Link.svelte";

    function create_fragment$e(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$e, 63, 0, 1735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 4 && /*ariaCurrent*/ ctx[2],
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let ariaCurrent;
    	let props;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(11, $location = value));
    	const dispatch = createEventDispatcher();
    	const resolve = useResolve();
    	const { navigate } = useHistory();

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = isCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction,
    		startsWith,
    		LINK_ID,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		isCurrent,
    		isPartiallyCurrent,
    		props,
    		ariaCurrent,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('to' in $$props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isCurrent' in $$props) $$invalidate(9, isCurrent = $$new_props.isCurrent);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 2080) {
    			// We need to pass location here to force re-resolution of the link,
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			$$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 2049) {
    			$$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 2049) {
    			$$invalidate(9, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 512) {
    			$$invalidate(2, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		$$invalidate(1, props = (() => {
    			if (isFunction(getProps)) {
    				const dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return { ...$$restProps, ...dynamicProps };
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isCurrent,
    		isPartiallyCurrent,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[5] === undefined && !('to' in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Link$1 = Link;

    var nickname$1="Ariel";var name$1="Ariel Lara Pedraza";var degree$1="Computer Systems Engineering";var specialization$1="Cybersecurity Specialist";var description$3=["I'm a Computer Systems Engineer specialized on Cybersecurity by the Instituto Tecnológico de Morelia. I have experience as full-stack developer, cybersecurity analyst, process automation, cloud security auditing ☁️, vulnerability management and SOC 🔐. I'm passionate on IT and I like to get updated on new technologies 🤓","I have strong knowledge on programming and scripting 🤖, on several programming languages and frameworks, and I'm in love with the IT community and the open source movement. Linux rocks! 🐧","I started working on IT since I was studying and I have stood out for being a proactive and cooperative person with the teams with which I have collaborated 👨‍💻"];var header$b="HELLO, I'M Ariel!";var download$1="Download PDF";var legend$1="This is a protected version, if you need the complete version please contact me!";var EN$6 = {nickname:nickname$1,name:name$1,degree:degree$1,specialization:specialization$1,description:description$3,header:header$b,download:download$1,legend:legend$1};

    var nickname="Ariel";var name="Ariel Lara Pedraza";var degree="Ingeniero en Sistemas Computacionales";var specialization="Especialista en Ciberseguridad";var description$2=["Soy un Ingeniero en Sistemas Computacionales especializado en Ciberseguridad por el Instituto Tecnológico de Morelia. Tengo experiencia como desarrollador full-stack, analista de seguridad, automatización de procesos, auditorías de seguridad de la nube ☁️, gestión de vulnerabilidades y SOC 🔐. Soy un apasionado de la informática en general y busco actualizarme continuamente en nuevas tecnologías 🤓","Tengo bases sólidas de seguridad informática, programación y scripting 🤖 en diversos lenguajes de programación y herramientas de desarrollo. Estoy enamorado de la comunidad de TI y del movimiento de software libre. ¡Me encanta Linux! 🐧","Comencé a trabajar en TI desde que era estudiante y me he destacado por ser una persona proactiva y cooperativa con los equipos con los que he colaborado 👨‍💻"];var header$a="¡Hola, soy Ariel!";var download="Descargar PDF";var legend="Esta es una version protegida, si necesita la version completa por favor contácteme";var ES$6 = {nickname:nickname,name:name,degree:degree,specialization:specialization,description:description$2,header:header$a,download:download,legend:legend};

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function blur(node, { delay = 0, duration = 400, easing = cubicInOut, amount = 5, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const f = style.filter === 'none' ? '' : style.filter;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `opacity: ${target_opacity - (od * u)}; filter: ${f} blur(${u * amount}px);`
        };
    }
    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    function preload(src) {
    	return new Promise(function (resolve) {
    		let img = new Image();
    		img.onload = resolve;
    		img.src = src;
    	});
    }

    /* src\routes\Info.svelte generated by Svelte v3.44.1 */
    const file$d = "src\\routes\\Info.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>   import EN from "../lang/EN_info.json";   import ES from "../lang/ES_info.json";   import { fade, blur }
    function create_catch_block$7(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$7.name,
    		type: "catch",
    		source: "(1:0) <script>   import EN from \\\"../lang/EN_info.json\\\";   import ES from \\\"../lang/ES_info.json\\\";   import { fade, blur }",
    		ctx
    	});

    	return block;
    }

    // (27:33)       <img       src={photo}
    function create_then_block$7(ctx) {
    	let img;
    	let img_src_value;
    	let img_intro;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*photo*/ ctx[7])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Ariel Lara");
    			attr_dev(img, "class", "photo svelte-19uy28k");
    			add_location(img, file$d, 27, 4, 673);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (!img_intro) {
    				add_render_callback(() => {
    					img_intro = create_in_transition(img, blur, { duration: 2000 });
    					img_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$7.name,
    		type: "then",
    		source: "(27:33)       <img       src={photo}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import EN from "../lang/EN_info.json";   import ES from "../lang/ES_info.json";   import { fade, blur }
    function create_pending_block$7(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$7.name,
    		type: "pending",
    		source: "(1:0) <script>   import EN from \\\"../lang/EN_info.json\\\";   import ES from \\\"../lang/ES_info.json\\\";   import { fade, blur }",
    		ctx
    	});

    	return block;
    }

    // (40:3) {#each description as pharagraph}
    function create_each_block$9(ctx) {
    	let p;
    	let t_value = /*pharagraph*/ ctx[10] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "description svelte-19uy28k");
    			add_location(p, file$d, 40, 4, 990);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(40:3) {#each description as pharagraph}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div4;
    	let h1;
    	let t1;
    	let div3;
    	let div0;
    	let t2;
    	let div2;
    	let h2;
    	let t4;
    	let h3;
    	let t6;
    	let h4;
    	let t8;
    	let t9;
    	let a0;
    	let t11;
    	let span;
    	let t13;
    	let div1;
    	let a1;
    	let i0;
    	let t14;
    	let a2;
    	let i1;
    	let t15;
    	let a3;
    	let i2;
    	let div4_intro;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$7,
    		then: create_then_block$7,
    		catch: create_catch_block$7,
    		value: 13
    	};

    	handle_promise(preload(/*photo*/ ctx[7]), info);
    	let each_value = /*description*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			h1 = element("h1");
    			h1.textContent = `${/*header*/ ctx[4]}`;
    			t1 = space();
    			div3 = element("div");
    			div0 = element("div");
    			info.block.c();
    			t2 = space();
    			div2 = element("div");
    			h2 = element("h2");
    			h2.textContent = `${/*name*/ ctx[1]}`;
    			t4 = space();
    			h3 = element("h3");
    			h3.textContent = `${/*degree*/ ctx[0]}`;
    			t6 = space();
    			h4 = element("h4");
    			h4.textContent = `${/*specialization*/ ctx[2]}`;
    			t8 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t9 = space();
    			a0 = element("a");
    			a0.textContent = `${/*download*/ ctx[5]}`;
    			t11 = space();
    			span = element("span");
    			span.textContent = `${/*legend*/ ctx[6]}`;
    			t13 = space();
    			div1 = element("div");
    			a1 = element("a");
    			i0 = element("i");
    			t14 = space();
    			a2 = element("a");
    			i1 = element("i");
    			t15 = space();
    			a3 = element("a");
    			i2 = element("i");
    			attr_dev(h1, "class", "no-point");
    			add_location(h1, file$d, 23, 1, 529);
    			attr_dev(div0, "class", "col-6 centered preloading svelte-19uy28k");
    			add_location(div0, file$d, 25, 2, 593);
    			attr_dev(h2, "id", "name");
    			attr_dev(h2, "class", "svelte-19uy28k");
    			add_location(h2, file$d, 36, 3, 837);
    			attr_dev(h3, "id", "degree");
    			attr_dev(h3, "class", "svelte-19uy28k");
    			add_location(h3, file$d, 37, 3, 867);
    			attr_dev(h4, "id", "specialization");
    			attr_dev(h4, "class", "svelte-19uy28k");
    			add_location(h4, file$d, 38, 3, 901);
    			attr_dev(a0, "id", "download");
    			attr_dev(a0, "href", '/Portfolium' + "/Ariel_Lara_Pedraza_CV_Sep_2024.pdf");
    			attr_dev(a0, "class", "svelte-19uy28k");
    			add_location(a0, file$d, 42, 3, 1046);
    			attr_dev(span, "id", "download-legend");
    			attr_dev(span, "class", "svelte-19uy28k");
    			add_location(span, file$d, 47, 3, 1164);
    			attr_dev(i0, "class", "fas fa-envelope fa-xs svelte-19uy28k");
    			add_location(i0, file$d, 50, 5, 1296);
    			attr_dev(a1, "href", "mailto:larapa99@gmail.com");
    			attr_dev(a1, "id", "to-mail");
    			attr_dev(a1, "class", "svelte-19uy28k");
    			add_location(a1, file$d, 49, 4, 1240);
    			attr_dev(i1, "class", "fab fa-github fa-xs  svelte-19uy28k");
    			add_location(i1, file$d, 53, 5, 1408);
    			attr_dev(a2, "href", "https://github.com/larapa99");
    			attr_dev(a2, "id", "to-github");
    			attr_dev(a2, "class", "svelte-19uy28k");
    			add_location(a2, file$d, 52, 4, 1348);
    			attr_dev(i2, "class", "fab fa-linkedin fa-xs svelte-19uy28k");
    			add_location(i2, file$d, 56, 5, 1530);
    			attr_dev(a3, "href", "https://www.linkedin.com/in/larapa99/");
    			attr_dev(a3, "id", "to-linkedin");
    			attr_dev(a3, "class", "svelte-19uy28k");
    			add_location(a3, file$d, 55, 4, 1458);
    			attr_dev(div1, "id", "social-media");
    			attr_dev(div1, "class", "svelte-19uy28k");
    			add_location(div1, file$d, 48, 3, 1211);
    			attr_dev(div2, "class", "col-6 body svelte-19uy28k");
    			add_location(div2, file$d, 35, 2, 808);
    			attr_dev(div3, "class", "container svelte-19uy28k");
    			add_location(div3, file$d, 24, 1, 566);
    			attr_dev(div4, "class", "fscreen");
    			add_location(div4, file$d, 22, 0, 476);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, h1);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			info.block.m(div0, info.anchor = null);
    			info.mount = () => div0;
    			info.anchor = null;
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, h2);
    			append_dev(div2, t4);
    			append_dev(div2, h3);
    			append_dev(div2, t6);
    			append_dev(div2, h4);
    			append_dev(div2, t8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div2, t9);
    			append_dev(div2, a0);
    			append_dev(div2, t11);
    			append_dev(div2, span);
    			append_dev(div2, t13);
    			append_dev(div2, div1);
    			append_dev(div1, a1);
    			append_dev(a1, i0);
    			append_dev(div1, t14);
    			append_dev(div1, a2);
    			append_dev(a2, i1);
    			append_dev(div1, t15);
    			append_dev(div1, a3);
    			append_dev(a3, i2);
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);

    			if (dirty & /*description*/ 8) {
    				each_value = /*description*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, t9);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			transition_in(info.block);

    			if (!div4_intro) {
    				add_render_callback(() => {
    					div4_intro = create_in_transition(div4, fade, { duration: 2000 });
    					div4_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Info', slots, []);
    	let lang = localStorage.getItem("LANG");
    	if (lang === "ES") lang = ES$6; else lang = EN$6;
    	let { nickname, degree, name, specialization, description, header, download, legend } = lang;
    	const photo = '/Portfolium' + "/images/photo.jpg";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Info> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		EN: EN$6,
    		ES: ES$6,
    		fade,
    		blur,
    		preload,
    		lang,
    		nickname,
    		degree,
    		name,
    		specialization,
    		description,
    		header,
    		download,
    		legend,
    		photo
    	});

    	$$self.$inject_state = $$props => {
    		if ('lang' in $$props) lang = $$props.lang;
    		if ('nickname' in $$props) nickname = $$props.nickname;
    		if ('degree' in $$props) $$invalidate(0, degree = $$props.degree);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('specialization' in $$props) $$invalidate(2, specialization = $$props.specialization);
    		if ('description' in $$props) $$invalidate(3, description = $$props.description);
    		if ('header' in $$props) $$invalidate(4, header = $$props.header);
    		if ('download' in $$props) $$invalidate(5, download = $$props.download);
    		if ('legend' in $$props) $$invalidate(6, legend = $$props.legend);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [degree, name, specialization, description, header, download, legend, photo];
    }

    class Info extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    var titles$1={languages:"Languages",programming:"Programming Languages",technologies:"Technologies",frameworks:"Frameworks & Libraries",tools:"Tools"};var header$9="SKILLS";var langs$1=[{name:"English",level:4,image:"/Portfolium//images/en.png"},{name:"Spanish",level:5,note:"Mother Language",image:"/Portfolium//images/spa.png"}];var plangs$1=[{name:"Python",image:"/Portfolium//images/python.png",level:5},{name:"JavaScript",image:"/Portfolium//images/js.png",level:4.5},{name:"Java",image:"/Portfolium//images/java.png",level:4.5},{name:"PowerShell",image:"/Portfolium//images/powershell.png",level:3},{name:"C++",image:"/Portfolium//images/cpp.png",level:4},{name:"PHP",image:"/Portfolium//images/php.png",level:4},{name:"Bash",image:"/Portfolium//images/bash.png",level:4}];var frameworks$1=[{name:"React/Native",image:"/Portfolium//images/react.png",level:4.5},{name:"JWT",image:"/Portfolium//images/jwt.png",level:3.5},{name:"Express",image:"/Portfolium//images/express.png",level:4},{name:"Svelte",image:"/Portfolium//images/svelte.png",level:2.5},{name:"Next.Js",image:"/Portfolium//images/nextjs.png",level:2.5},{name:"Laravel",image:"/Portfolium//images/laravel.png",level:4},{name:"Socket.io",image:"/Portfolium//images/socketio.png",level:4},{name:"Sequelize",image:"/Portfolium//images/sequelize.png",level:4},{name:"Selenium",image:"/Portfolium//images/selenium.png",level:4}];var tools$1=[{name:"Zscaler",image:"/Portfolium//images/zscaler.png",level:3},{name:"CrowdStrike",image:"/Portfolium//images/crowdstrike.png",level:3},{name:"Security Scorecard",image:"/Portfolium//images/scorecard.png",level:3},{name:"QRadar",image:"/Portfolium//images/qradar.png",level:3},{name:"Nessus",image:"/Portfolium//images/nessus.png",level:3},{name:"MegaplanIT",image:"/Portfolium//images/megaplanit.png",level:3},{name:"Azure Windows Defender",image:"/Portfolium//images/defender.png",level:3},{name:"VMWare EXSI",image:"/Portfolium//images/exsi.png",level:3},{name:"Netskope",image:"/Portfolium//images/netskope.png",level:3},{name:"CloudHealth Secure State",image:"/Portfolium//images/cloudhealth.png",level:3},{name:"Wiz.io",image:"/Portfolium//images/wiz.png",level:3},{name:"ServiceNow",image:"/Portfolium//images/snc.png",level:3},{name:"Tableau",image:"/Portfolium//images/tableau.png",level:3},{name:"Microsoft Excel",image:"/Portfolium//images/excel.png",level:4}];var technologies$1=[{name:"Linux",image:"/Portfolium//images/linux.png",level:4},{name:"Windows",image:"/Portfolium//images/windows.png",level:4},{name:"MacOS",image:"/Portfolium//images/macos.png",level:4},{name:"AWS",image:"/Portfolium//images/aws.png",level:4},{name:"Azure",image:"/Portfolium//images/azure.png",level:4},{name:"GCP",image:"/Portfolium//images/gcp.png",level:4},{name:"MySQL",image:"/Portfolium//images/mysql.png",level:4.5},{name:"SQL Server",image:"/Portfolium//images/mssql.png",level:4},{name:"Docker",image:"/Portfolium//images/docker.png",level:3},{name:"NodeJS",image:"/Portfolium//images/nodejs.png",level:4},{name:"GIT",image:"/Portfolium//images/git.png",level:4},{name:"Raspberry Pi",image:"/Portfolium//images/rpi.png",level:4.5},{name:"Arduino",image:"/Portfolium//images/arduino.png",level:4},{name:"Kubernetes",image:"/Portfolium//images/kubernetes.png",level:4}];var EN$5 = {titles:titles$1,header:header$9,langs:langs$1,plangs:plangs$1,frameworks:frameworks$1,tools:tools$1,technologies:technologies$1};

    var titles={languages:"Idiomas",programming:"Lenguajes de programación",technologies:"Tecnologías",frameworks:"Frameworks & Librerías",tools:"Herramientas"};var header$8="Habilidades";var langs=[{name:"English",level:4,image:"/Portfolium//images/en.png"},{name:"Spanish",level:5,note:"Mother Language",image:"/Portfolium//images/spa.png"}];var plangs=[{name:"Python",image:"/Portfolium//images/python.png",level:5},{name:"JavaScript",image:"/Portfolium//images/js.png",level:4.5},{name:"Java",image:"/Portfolium//images/java.png",level:4.5},{name:"PowerShell",image:"/Portfolium//images/powershell.png",level:3},{name:"C++",image:"/Portfolium//images/cpp.png",level:4},{name:"PHP",image:"/Portfolium//images/php.png",level:4},{name:"Bash",image:"/Portfolium//images/bash.png",level:4}];var frameworks=[{name:"React/Native",image:"/Portfolium//images/react.png",level:4.5},{name:"JWT",image:"/Portfolium//images/jwt.png",level:3.5},{name:"Express",image:"/Portfolium//images/express.png",level:4},{name:"Svelte",image:"/Portfolium//images/svelte.png",level:2.5},{name:"Next.Js",image:"/Portfolium//images/nextjs.png",level:2.5},{name:"Laravel",image:"/Portfolium//images/laravel.png",level:4},{name:"Socket.io",image:"/Portfolium//images/socketio.png",level:4},{name:"Sequelize",image:"/Portfolium//images/sequelize.png",level:4},{name:"Selenium",image:"/Portfolium//images/selenium.png",level:4}];var tools=[{name:"Zscaler",image:"/Portfolium//images/zscaler.png",level:3},{name:"CrowdStrike",image:"/Portfolium//images/crowdstrike.png",level:3},{name:"Security Scorecard",image:"/Portfolium//images/scorecard.png",level:3},{name:"QRadar",image:"/Portfolium//images/qradar.png",level:3},{name:"Nessus",image:"/Portfolium//images/nessus.png",level:3},{name:"MegaplanIT",image:"/Portfolium//images/megaplanit.png",level:3},{name:"Azure Windows Defender",image:"/Portfolium//images/defender.png",level:3},{name:"VMWare EXSI",image:"/Portfolium//images/exsi.png",level:3},{name:"Netskope",image:"/Portfolium//images/netskope.png",level:3},{name:"CloudHealth Secure State",image:"/Portfolium//images/cloudhealth.png",level:3},{name:"Wiz.io",image:"/Portfolium//images/wiz.png",level:3},{name:"ServiceNow",image:"/Portfolium//images/snc.png",level:3},{name:"Tableau",image:"/Portfolium//images/tableau.png",level:3},{name:"Microsoft Excel",image:"/Portfolium//images/excel.png",level:4}];var technologies=[{name:"Linux",image:"/Portfolium//images/linux.png",level:4},{name:"Windows",image:"/Portfolium//images/windows.png",level:4},{name:"MacOS",image:"/Portfolium//images/macos.png",level:4},{name:"AWS",image:"/Portfolium//images/aws.png",level:4},{name:"Azure",image:"/Portfolium//images/azure.png",level:4},{name:"GCP",image:"/Portfolium//images/gcp.png",level:4},{name:"MySQL",image:"/Portfolium//images/mysql.png",level:4.5},{name:"SQL Server",image:"/Portfolium//images/mssql.png",level:4},{name:"Docker",image:"/Portfolium//images/docker.png",level:3},{name:"NodeJS",image:"/Portfolium//images/nodejs.png",level:4},{name:"GIT",image:"/Portfolium//images/git.png",level:4},{name:"Raspberry Pi",image:"/Portfolium//images/rpi.png",level:4.5},{name:"Arduino",image:"/Portfolium//images/arduino.png",level:4},{name:"Kubernetes",image:"/Portfolium//images/kubernetes.png",level:4}];var ES$5 = {titles:titles,header:header$8,langs:langs,plangs:plangs,frameworks:frameworks,tools:tools,technologies:technologies};

    /* src\components\LangCard.svelte generated by Svelte v3.44.1 */
    const file$c = "src\\components\\LangCard.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (9:1) {#if lang.image}
    function create_if_block_1$4(ctx) {
    	let await_block_anchor;
    	let promise;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$6,
    		then: create_then_block$6,
    		catch: create_catch_block$6,
    		value: 1
    	};

    	handle_promise(promise = preload(/*lang*/ ctx[0].image), info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*lang*/ 1 && promise !== (promise = preload(/*lang*/ ctx[0].image)) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			transition_in(info.block);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(9:1) {#if lang.image}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { blur }
    function create_catch_block$6(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$6.name,
    		type: "catch",
    		source: "(1:0) <script>   import { blur }",
    		ctx
    	});

    	return block;
    }

    // (10:37)      <img      src={lang.image}
    function create_then_block$6(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_intro;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*lang*/ ctx[0].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*lang*/ ctx[0].name);
    			attr_dev(img, "class", "image svelte-171ucns");
    			add_location(img, file$c, 10, 3, 252);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*lang*/ 1 && !src_url_equal(img.src, img_src_value = /*lang*/ ctx[0].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*lang*/ 1 && img_alt_value !== (img_alt_value = /*lang*/ ctx[0].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		i: function intro(local) {
    			if (!img_intro) {
    				add_render_callback(() => {
    					img_intro = create_in_transition(img, blur, { duration: 3000 });
    					img_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$6.name,
    		type: "then",
    		source: "(10:37)      <img      src={lang.image}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { blur }
    function create_pending_block$6(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$6.name,
    		type: "pending",
    		source: "(1:0) <script>   import { blur }",
    		ctx
    	});

    	return block;
    }

    // (20:2) {#each Array(Math.floor(lang.level)) as _, i}
    function create_each_block_1$3(ctx) {
    	let i_1;

    	const block = {
    		c: function create() {
    			i_1 = element("i");
    			attr_dev(i_1, "class", "fas fa-star svelte-171ucns");
    			add_location(i_1, file$c, 20, 3, 455);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i_1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(20:2) {#each Array(Math.floor(lang.level)) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#if lang.level % Math.floor(lang.level) !== 0}
    function create_if_block$6(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-star-half-alt svelte-171ucns");
    			add_location(i, file$c, 23, 3, 547);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(23:2) {#if lang.level % Math.floor(lang.level) !== 0}",
    		ctx
    	});

    	return block;
    }

    // (26:2) {#each Array(5 - Math.round(lang.level)) as _, i}
    function create_each_block$8(ctx) {
    	let i_1;

    	const block = {
    		c: function create() {
    			i_1 = element("i");
    			attr_dev(i_1, "class", "far fa-star svelte-171ucns");
    			add_location(i_1, file$c, 26, 3, 648);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i_1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(26:2) {#each Array(5 - Math.round(lang.level)) as _, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div1;
    	let h2;
    	let t0_value = /*lang*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let div0;
    	let t3;
    	let show_if = /*lang*/ ctx[0].level % Math.floor(/*lang*/ ctx[0].level) !== 0;
    	let t4;
    	let if_block0 = /*lang*/ ctx[0].image && create_if_block_1$4(ctx);
    	let each_value_1 = Array(Math.floor(/*lang*/ ctx[0].level));
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	let if_block1 = show_if && create_if_block$6(ctx);
    	let each_value = Array(5 - Math.round(/*lang*/ ctx[0].level));
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "svelte-171ucns");
    			add_location(h2, file$c, 7, 1, 169);
    			attr_dev(div0, "class", "stars svelte-171ucns");
    			add_location(div0, file$c, 18, 1, 382);
    			attr_dev(div1, "class", "container svelte-171ucns");
    			add_location(div1, file$c, 6, 0, 143);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h2);
    			append_dev(h2, t0);
    			append_dev(div1, t1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div0, t3);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*lang*/ 1 && t0_value !== (t0_value = /*lang*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (/*lang*/ ctx[0].image) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*lang*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*lang*/ 1) {
    				const old_length = each_value_1.length;
    				each_value_1 = Array(Math.floor(/*lang*/ ctx[0].level));
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = old_length; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (!each_blocks_1[i]) {
    						each_blocks_1[i] = create_each_block_1$3(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, t3);
    					}
    				}

    				for (i = each_value_1.length; i < old_length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*lang*/ 1) show_if = /*lang*/ ctx[0].level % Math.floor(/*lang*/ ctx[0].level) !== 0;

    			if (show_if) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$6(ctx);
    					if_block1.c();
    					if_block1.m(div0, t4);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*lang*/ 1) {
    				const old_length = each_value.length;
    				each_value = Array(5 - Math.round(/*lang*/ ctx[0].level));
    				validate_each_argument(each_value);
    				let i;

    				for (i = old_length; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (!each_blocks[i]) {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (i = each_value.length; i < old_length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			transition_in(if_block0);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks_1, detaching);
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LangCard', slots, []);
    	let { lang = null } = $$props;
    	const writable_props = ['lang'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LangCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    	};

    	$$self.$capture_state = () => ({ blur, preload, lang });

    	$$self.$inject_state = $$props => {
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lang];
    }

    class LangCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { lang: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LangCard",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get lang() {
    		throw new Error("<LangCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lang(value) {
    		throw new Error("<LangCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ItemCard.svelte generated by Svelte v3.44.1 */
    const file$b = "src\\components\\ItemCard.svelte";

    // (1:0) <script>   import { blur }
    function create_catch_block$5(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$5.name,
    		type: "catch",
    		source: "(1:0) <script>   import { blur }",
    		ctx
    	});

    	return block;
    }

    // (8:35)    <div class="container">    {#if item.image}
    function create_then_block$5(ctx) {
    	let div;
    	let t0;
    	let p;
    	let t1_value = /*item*/ ctx[0].name + "";
    	let t1;
    	let if_block = /*item*/ ctx[0].image && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			attr_dev(p, "class", "svelte-10ct0i8");
    			add_location(p, file$b, 17, 2, 351);
    			attr_dev(div, "class", "container svelte-10ct0i8");
    			add_location(div, file$b, 8, 1, 183);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, p);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (/*item*/ ctx[0].image) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*item*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*item*/ 1 && t1_value !== (t1_value = /*item*/ ctx[0].name + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			transition_in(if_block);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$5.name,
    		type: "then",
    		source: "(8:35)    <div class=\\\"container\\\">    {#if item.image}",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#if item.image}
    function create_if_block$5(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_intro;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[0].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*item*/ ctx[0].name);
    			attr_dev(img, "class", "image svelte-10ct0i8");
    			add_location(img, file$b, 10, 3, 231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item*/ 1 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[0].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*item*/ 1 && img_alt_value !== (img_alt_value = /*item*/ ctx[0].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		i: function intro(local) {
    			if (!img_intro) {
    				add_render_callback(() => {
    					img_intro = create_in_transition(img, blur, { duration: 2000 });
    					img_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(10:2) {#if item.image}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { blur }
    function create_pending_block$5(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$5.name,
    		type: "pending",
    		source: "(1:0) <script>   import { blur }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let await_block_anchor;
    	let promise;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$5,
    		then: create_then_block$5,
    		catch: create_catch_block$5,
    		value: 1
    	};

    	handle_promise(promise = preload(/*item*/ ctx[0].image), info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*item*/ 1 && promise !== (promise = preload(/*item*/ ctx[0].image)) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			transition_in(info.block);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ItemCard', slots, []);
    	let { item = null } = $$props;
    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ItemCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({ blur, preload, item });

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item];
    }

    class ItemCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ItemCard",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get item() {
    		throw new Error("<ItemCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<ItemCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Skills.svelte generated by Svelte v3.44.1 */
    const file$a = "src\\routes\\Skills.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (20:3) {#each langs as lang, index}
    function create_each_block_4(ctx) {
    	let langcard;
    	let current;

    	langcard = new LangCard({
    			props: { lang: /*lang*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(langcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(langcard, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(langcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(langcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(langcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(20:3) {#each langs as lang, index}",
    		ctx
    	});

    	return block;
    }

    // (26:3) {#each plangs as item, index}
    function create_each_block_3(ctx) {
    	let itemcard;
    	let current;

    	itemcard = new ItemCard({
    			props: { item: /*item*/ ctx[8] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(itemcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(itemcard, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(itemcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(26:3) {#each plangs as item, index}",
    		ctx
    	});

    	return block;
    }

    // (32:3) {#each technologies as item, index}
    function create_each_block_2$2(ctx) {
    	let itemcard;
    	let current;

    	itemcard = new ItemCard({
    			props: { item: /*item*/ ctx[8] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(itemcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(itemcard, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(itemcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(32:3) {#each technologies as item, index}",
    		ctx
    	});

    	return block;
    }

    // (38:3) {#each tools as item, index}
    function create_each_block_1$2(ctx) {
    	let itemcard;
    	let current;

    	itemcard = new ItemCard({
    			props: { item: /*item*/ ctx[8] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(itemcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(itemcard, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(itemcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(38:3) {#each tools as item, index}",
    		ctx
    	});

    	return block;
    }

    // (44:3) {#each frameworks as item, index}
    function create_each_block$7(ctx) {
    	let itemcard;
    	let current;

    	itemcard = new ItemCard({
    			props: { item: /*item*/ ctx[8] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(itemcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(itemcard, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(itemcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(44:3) {#each frameworks as item, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div6;
    	let h1;
    	let t1;
    	let div5;
    	let h20;
    	let t3;
    	let div0;
    	let t4;
    	let h21;
    	let t6;
    	let div1;
    	let t7;
    	let h22;
    	let t9;
    	let div2;
    	let t10;
    	let h23;
    	let t12;
    	let div3;
    	let t13;
    	let h24;
    	let t15;
    	let div4;
    	let div6_intro;
    	let current;
    	let each_value_4 = /*langs*/ ctx[2];
    	validate_each_argument(each_value_4);
    	let each_blocks_4 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_4[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const out = i => transition_out(each_blocks_4[i], 1, 1, () => {
    		each_blocks_4[i] = null;
    	});

    	let each_value_3 = /*plangs*/ ctx[1];
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const out_1 = i => transition_out(each_blocks_3[i], 1, 1, () => {
    		each_blocks_3[i] = null;
    	});

    	let each_value_2 = /*technologies*/ ctx[5];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	const out_2 = i => transition_out(each_blocks_2[i], 1, 1, () => {
    		each_blocks_2[i] = null;
    	});

    	let each_value_1 = /*tools*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const out_3 = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*frameworks*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const out_4 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			h1 = element("h1");
    			h1.textContent = `${/*header*/ ctx[7]}`;
    			t1 = space();
    			div5 = element("div");
    			h20 = element("h2");
    			h20.textContent = `${/*titles*/ ctx[6]["languages"]}`;
    			t3 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].c();
    			}

    			t4 = space();
    			h21 = element("h2");
    			h21.textContent = `${/*titles*/ ctx[6]["programming"]}`;
    			t6 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t7 = space();
    			h22 = element("h2");
    			h22.textContent = `${/*titles*/ ctx[6]["technologies"]}`;
    			t9 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t10 = space();
    			h23 = element("h2");
    			h23.textContent = `${/*titles*/ ctx[6]["tools"]}`;
    			t12 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t13 = space();
    			h24 = element("h2");
    			h24.textContent = `${/*titles*/ ctx[6]["frameworks"]}`;
    			t15 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$a, 15, 1, 509);
    			attr_dev(h20, "class", "svelte-lmo1dv");
    			add_location(h20, file$a, 17, 2, 556);
    			attr_dev(div0, "class", "langs svelte-lmo1dv");
    			add_location(div0, file$a, 18, 2, 590);
    			attr_dev(h21, "class", "svelte-lmo1dv");
    			add_location(h21, file$a, 23, 2, 693);
    			attr_dev(div1, "class", "items svelte-lmo1dv");
    			add_location(div1, file$a, 24, 2, 729);
    			attr_dev(h22, "class", "svelte-lmo1dv");
    			add_location(h22, file$a, 29, 2, 833);
    			attr_dev(div2, "class", "items svelte-lmo1dv");
    			add_location(div2, file$a, 30, 2, 870);
    			attr_dev(h23, "class", "svelte-lmo1dv");
    			add_location(h23, file$a, 35, 2, 980);
    			attr_dev(div3, "class", "items svelte-lmo1dv");
    			add_location(div3, file$a, 36, 2, 1010);
    			attr_dev(h24, "class", "svelte-lmo1dv");
    			add_location(h24, file$a, 41, 2, 1113);
    			attr_dev(div4, "class", "items svelte-lmo1dv");
    			add_location(div4, file$a, 42, 2, 1148);
    			attr_dev(div5, "class", "container svelte-lmo1dv");
    			add_location(div5, file$a, 16, 1, 529);
    			attr_dev(div6, "class", "fscreen");
    			add_location(div6, file$a, 14, 0, 456);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, h1);
    			append_dev(div6, t1);
    			append_dev(div6, div5);
    			append_dev(div5, h20);
    			append_dev(div5, t3);
    			append_dev(div5, div0);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].m(div0, null);
    			}

    			append_dev(div5, t4);
    			append_dev(div5, h21);
    			append_dev(div5, t6);
    			append_dev(div5, div1);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(div1, null);
    			}

    			append_dev(div5, t7);
    			append_dev(div5, h22);
    			append_dev(div5, t9);
    			append_dev(div5, div2);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div2, null);
    			}

    			append_dev(div5, t10);
    			append_dev(div5, h23);
    			append_dev(div5, t12);
    			append_dev(div5, div3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div3, null);
    			}

    			append_dev(div5, t13);
    			append_dev(div5, h24);
    			append_dev(div5, t15);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*langs*/ 4) {
    				each_value_4 = /*langs*/ ctx[2];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks_4[i]) {
    						each_blocks_4[i].p(child_ctx, dirty);
    						transition_in(each_blocks_4[i], 1);
    					} else {
    						each_blocks_4[i] = create_each_block_4(child_ctx);
    						each_blocks_4[i].c();
    						transition_in(each_blocks_4[i], 1);
    						each_blocks_4[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_4.length; i < each_blocks_4.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*plangs*/ 2) {
    				each_value_3 = /*plangs*/ ctx[1];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    						transition_in(each_blocks_3[i], 1);
    					} else {
    						each_blocks_3[i] = create_each_block_3(child_ctx);
    						each_blocks_3[i].c();
    						transition_in(each_blocks_3[i], 1);
    						each_blocks_3[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_3.length; i < each_blocks_3.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*technologies*/ 32) {
    				each_value_2 = /*technologies*/ ctx[5];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    						transition_in(each_blocks_2[i], 1);
    					} else {
    						each_blocks_2[i] = create_each_block_2$2(child_ctx);
    						each_blocks_2[i].c();
    						transition_in(each_blocks_2[i], 1);
    						each_blocks_2[i].m(div2, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_2.length; i += 1) {
    					out_2(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*tools*/ 16) {
    				each_value_1 = /*tools*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div3, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out_3(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*frameworks*/ 8) {
    				each_value = /*frameworks*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div4, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_4(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_4.length; i += 1) {
    				transition_in(each_blocks_4[i]);
    			}

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks_3[i]);
    			}

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			if (!div6_intro) {
    				add_render_callback(() => {
    					div6_intro = create_in_transition(div6, fade, { duration: 3000 });
    					div6_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_4 = each_blocks_4.filter(Boolean);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				transition_out(each_blocks_4[i]);
    			}

    			each_blocks_3 = each_blocks_3.filter(Boolean);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				transition_out(each_blocks_3[i]);
    			}

    			each_blocks_2 = each_blocks_2.filter(Boolean);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				transition_out(each_blocks_2[i]);
    			}

    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_each(each_blocks_4, detaching);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skills', slots, []);
    	let lang = localStorage.getItem("LANG");
    	if (lang === "ES") lang = ES$5; else lang = EN$5;
    	let { plangs, langs, frameworks, tools, technologies, titles, header } = lang;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fade,
    		fly,
    		slide,
    		EN: EN$5,
    		ES: ES$5,
    		LangCard,
    		ItemCard,
    		lang,
    		plangs,
    		langs,
    		frameworks,
    		tools,
    		technologies,
    		titles,
    		header
    	});

    	$$self.$inject_state = $$props => {
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    		if ('plangs' in $$props) $$invalidate(1, plangs = $$props.plangs);
    		if ('langs' in $$props) $$invalidate(2, langs = $$props.langs);
    		if ('frameworks' in $$props) $$invalidate(3, frameworks = $$props.frameworks);
    		if ('tools' in $$props) $$invalidate(4, tools = $$props.tools);
    		if ('technologies' in $$props) $$invalidate(5, technologies = $$props.technologies);
    		if ('titles' in $$props) $$invalidate(6, titles = $$props.titles);
    		if ('header' in $$props) $$invalidate(7, header = $$props.header);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lang, plangs, langs, frameworks, tools, technologies, titles, header];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\EducationCard.svelte generated by Svelte v3.44.1 */
    const file$9 = "src\\components\\EducationCard.svelte";

    // (14:4) {#if data.image}
    function create_if_block_5$2(ctx) {
    	let await_block_anchor;
    	let promise;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$4,
    		then: create_then_block$4,
    		catch: create_catch_block$4,
    		value: 2
    	};

    	handle_promise(promise = preload(/*data*/ ctx[0].image), info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*data*/ 1 && promise !== (promise = preload(/*data*/ ctx[0].image)) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			transition_in(info.block);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(14:4) {#if data.image}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { fade, blur }
    function create_catch_block$4(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$4.name,
    		type: "catch",
    		source: "(1:0) <script>   import { fade, blur }",
    		ctx
    	});

    	return block;
    }

    // (15:40)         <img         src={data.image}
    function create_then_block$4(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_intro;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*data*/ ctx[0].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*data*/ ctx[0].key);
    			attr_dev(img, "class", "image svelte-10jbi9z");
    			add_location(img, file$9, 15, 6, 406);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && !src_url_equal(img.src, img_src_value = /*data*/ ctx[0].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*data*/ 1 && img_alt_value !== (img_alt_value = /*data*/ ctx[0].key)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		i: function intro(local) {
    			if (!img_intro) {
    				add_render_callback(() => {
    					img_intro = create_in_transition(img, blur, { duration: 2000 });
    					img_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$4.name,
    		type: "then",
    		source: "(15:40)         <img         src={data.image}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { fade, blur }
    function create_pending_block$4(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$4.name,
    		type: "pending",
    		source: "(1:0) <script>   import { fade, blur }",
    		ctx
    	});

    	return block;
    }

    // (26:4) {#if data.title}
    function create_if_block_4$3(ctx) {
    	let h2;
    	let t_value = /*data*/ ctx[0].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(t_value);
    			attr_dev(h2, "class", "svelte-10jbi9z");
    			add_location(h2, file$9, 26, 5, 641);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*data*/ ctx[0].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(26:4) {#if data.title}",
    		ctx
    	});

    	return block;
    }

    // (29:4) {#if data.subtitle}
    function create_if_block_3$3(ctx) {
    	let h4;
    	let t_value = /*data*/ ctx[0].subtitle + "";
    	let t;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t = text(t_value);
    			attr_dev(h4, "class", "svelte-10jbi9z");
    			add_location(h4, file$9, 29, 5, 705);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*data*/ ctx[0].subtitle + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(29:4) {#if data.subtitle}",
    		ctx
    	});

    	return block;
    }

    // (32:4) {#if data.date}
    function create_if_block_2$3(ctx) {
    	let h3;
    	let t_value = /*data*/ ctx[0].date + "";
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(t_value);
    			attr_dev(h3, "class", "svelte-10jbi9z");
    			add_location(h3, file$9, 32, 5, 768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*data*/ ctx[0].date + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(32:4) {#if data.date}",
    		ctx
    	});

    	return block;
    }

    // (37:2) {#if data.description}
    function create_if_block_1$3(ctx) {
    	let p;
    	let t_value = /*data*/ ctx[0].description + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "svelte-10jbi9z");
    			add_location(p, file$9, 37, 3, 851);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*data*/ ctx[0].description + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(37:2) {#if data.description}",
    		ctx
    	});

    	return block;
    }

    // (40:2) {#if data.link && data.alias}
    function create_if_block$4(ctx) {
    	let a;
    	let t0;
    	let t1;
    	let span;
    	let t2_value = /*data*/ ctx[0].alias + "";
    	let t2;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(/*goto*/ ctx[1]);
    			t1 = space();
    			span = element("span");
    			t2 = text(t2_value);
    			attr_dev(span, "class", "svelte-10jbi9z");
    			add_location(span, file$9, 40, 30, 950);
    			attr_dev(a, "href", a_href_value = /*data*/ ctx[0].link);
    			attr_dev(a, "class", "svelte-10jbi9z");
    			add_location(a, file$9, 40, 3, 923);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			append_dev(a, span);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*goto*/ 2) set_data_dev(t0, /*goto*/ ctx[1]);
    			if (dirty & /*data*/ 1 && t2_value !== (t2_value = /*data*/ ctx[0].alias + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*data*/ 1 && a_href_value !== (a_href_value = /*data*/ ctx[0].link)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(40:2) {#if data.link && data.alias}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let if_block0 = /*data*/ ctx[0].image && create_if_block_5$2(ctx);
    	let if_block1 = /*data*/ ctx[0].title && create_if_block_4$3(ctx);
    	let if_block2 = /*data*/ ctx[0].subtitle && create_if_block_3$3(ctx);
    	let if_block3 = /*data*/ ctx[0].date && create_if_block_2$3(ctx);
    	let if_block4 = /*data*/ ctx[0].description && create_if_block_1$3(ctx);
    	let if_block5 = /*data*/ ctx[0].link && /*data*/ ctx[0].alias && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			if (if_block5) if_block5.c();
    			attr_dev(div0, "class", "col-6 centered");
    			add_location(div0, file$9, 12, 3, 306);
    			attr_dev(div1, "class", "col-6 centered data-container svelte-10jbi9z");
    			add_location(div1, file$9, 24, 3, 569);
    			attr_dev(div2, "class", "title-container svelte-10jbi9z");
    			add_location(div2, file$9, 11, 2, 272);
    			attr_dev(div3, "class", "container svelte-10jbi9z");
    			add_location(div3, file$9, 10, 1, 245);
    			attr_dev(div4, "class", "col-6");
    			add_location(div4, file$9, 9, 0, 223);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t1);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t2);
    			if (if_block3) if_block3.m(div1, null);
    			append_dev(div3, t3);
    			if (if_block4) if_block4.m(div3, null);
    			append_dev(div3, t4);
    			if (if_block5) if_block5.m(div3, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*data*/ ctx[0].image) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*data*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*data*/ ctx[0].title) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4$3(ctx);
    					if_block1.c();
    					if_block1.m(div1, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*data*/ ctx[0].subtitle) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3$3(ctx);
    					if_block2.c();
    					if_block2.m(div1, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*data*/ ctx[0].date) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_2$3(ctx);
    					if_block3.c();
    					if_block3.m(div1, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*data*/ ctx[0].description) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_1$3(ctx);
    					if_block4.c();
    					if_block4.m(div3, t4);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*data*/ ctx[0].link && /*data*/ ctx[0].alias) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block$4(ctx);
    					if_block5.c();
    					if_block5.m(div3, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}
    		},
    		i: function intro(local) {
    			transition_in(if_block0);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EducationCard', slots, []);
    	let { data = null } = $$props;
    	let { goto = "go to" } = $$props;
    	const writable_props = ['data', 'goto'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EducationCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('goto' in $$props) $$invalidate(1, goto = $$props.goto);
    	};

    	$$self.$capture_state = () => ({ fade, blur, preload, Link: Link$1, data, goto });

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('goto' in $$props) $$invalidate(1, goto = $$props.goto);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, goto];
    }

    class EducationCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { data: 0, goto: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EducationCard",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get data() {
    		throw new Error("<EducationCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<EducationCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get goto() {
    		throw new Error("<EducationCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set goto(value) {
    		throw new Error("<EducationCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var main$3={university:"Technological Institute of Morelia",degree:"Computer Systems Engineer"};var data$3=[{key:1,title:"Instituto Tecnológico de México",subtitle:"Instituto Tecnológico de Morelia",image:"/Portfolium//images/tecnm.png",description:"I studied Computer Systems Engineering at the Instituto Tecnológico de México campus Morelia, I have just finished a bachelor degree on Cybersecurity specialization. I've made a lot of scholar projects about every topic of the informatics, since web technologies to microcontroller and assembly language programing.",date:"2017 - 2022",link:"https://www.morelia.tecnm.mx/",alias:"tecnm"},{key:2,title:"Cisco",subtitle:"Netacad",image:"/Portfolium//images/cisco.png",description:"I have a couple of certificades of the program Cisco CCNA Routing and Switching (CCNA R&S) from Cisco Netacad and the Instituto Tecnológico de Morelia: Introduction to routing and switching; and Network Scaling. \n Also, I have a certificade of Introduction to Cybersecurity by this institute.",date:"2021",link:"https://www.netacad.com/",alias:"netacad"},{key:3,title:"Platzi",subtitle:"Online academy",image:"/Portfolium//images/platzi.png",description:"I've taken many of the courses presented by Platzi as a reinforcement of the topics taken at my university, with this courses I enhanced  my knowledge on some technologies like: Python, JavaScript, NodeJS, React, Docker, Kubernetes, etc.",date:"2020 - 2021",link:"https://platzi.com/",alias:"platzi"}];var header$7="EDUCATION";var goto$3="go to";var by$1="by";var EN$4 = {main:main$3,data:data$3,header:header$7,goto:goto$3,by:by$1};

    var main$2={university:"Instituto Tecnológico de Morelia",degree:"Ingeniero en Sistemas Computacionales"};var data$2=[{key:1,title:"Instituto Tecnológico de México",subtitle:"Instituto Tecnológico de Morelia",image:"/Portfolium//images/tecnm.png",description:"Estudié Ingeniería en Sistemas Computacionales en el Instituto Tecnológico de México campus Morelia. Terminé la licenciatura con especialidad en Seguridad de la Información. He hecho muchos proyectos escolares relacionados con muchos temas de informática, desde tecnoloigías web hasta microcontroladores y legnuaje ensamblador para sistemas embebidos.",date:"2017 - 2022",link:"https://www.morelia.tecnm.mx/",alias:"tecnm"},{key:2,title:"Cisco",subtitle:"Netacad",image:"/Portfolium//images/cisco.png",description:"Cuento con dos certificados de los cursos del programa Cisco CCNA Routing and Switching (CCNA R&S) por parte de Cisco Netacad y el Instituto Tecnológico de Morelia: Principios de routing y switching; y Escalamiento de redes. \nAdemás, cuento con un certificado de Introduccion a la ciberseguridad por parte de esta institución.",date:"2020 - 2021",link:"https://www.netacad.com/",alias:"netacad"},{key:3,title:"Platzi",subtitle:"Academia en linea",image:"/Portfolium//images/platzi.png",description:"Realizé varios de los cursos que se presentan en la plataforma de Platzi como refuerzo de los temas que tomé en mi universidad, con estos cursos pude fortalecer mis conocimientos en diversas tecnologías como: Python, JavaScript, NodeJs, React, Docker, Kubernetes, entre otros.",date:"2020 - 2021",link:"https://platzi.com/",alias:"platzi"}];var header$6="Educación";var goto$2="ir a";var by="por";var ES$4 = {main:main$2,data:data$2,header:header$6,goto:goto$2,by:by};

    /* src\routes\Education.svelte generated by Svelte v3.44.1 */
    const file$8 = "src\\routes\\Education.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (27:2) {#each data as data (data.key)}
    function create_each_block$6(key_1, ctx) {
    	let first;
    	let card;
    	let current;

    	card = new EducationCard({
    			props: {
    				data: /*data*/ ctx[4],
    				goto: /*goto*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(card.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(27:2) {#each data as data (data.key)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div2;
    	let h1;
    	let t1;
    	let div0;
    	let p;
    	let b0;
    	let t3;
    	let t4;
    	let t5;
    	let b1;
    	let t7;
    	let div1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let div2_intro;
    	let current;
    	let each_value = /*data*/ ctx[4];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*data*/ ctx[4].key;
    	validate_each_keys(ctx, each_value, get_each_context$6, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$6(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$6(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = `${/*header*/ ctx[1]}`;
    			t1 = space();
    			div0 = element("div");
    			p = element("p");
    			b0 = element("b");
    			b0.textContent = `${/*main*/ ctx[0].degree}`;
    			t3 = space();
    			t4 = text(/*by*/ ctx[3]);
    			t5 = space();
    			b1 = element("b");
    			b1.textContent = `${/*main*/ ctx[0].university}`;
    			t7 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$8, 13, 1, 411);
    			attr_dev(b0, "class", "svelte-1v9hz6a");
    			add_location(b0, file$8, 16, 3, 470);
    			attr_dev(b1, "class", "svelte-1v9hz6a");
    			add_location(b1, file$8, 20, 3, 515);
    			attr_dev(p, "class", "svelte-1v9hz6a");
    			add_location(p, file$8, 15, 2, 462);
    			attr_dev(div0, "class", "main centered svelte-1v9hz6a");
    			add_location(div0, file$8, 14, 1, 431);
    			attr_dev(div1, "class", "container svelte-1v9hz6a");
    			add_location(div1, file$8, 25, 1, 570);
    			attr_dev(div2, "class", "fscreen");
    			add_location(div2, file$8, 12, 0, 358);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, p);
    			append_dev(p, b0);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(p, t5);
    			append_dev(p, b1);
    			append_dev(div2, t7);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data, goto*/ 20) {
    				each_value = /*data*/ ctx[4];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$6, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div1, outro_and_destroy_block, create_each_block$6, null, get_each_context$6);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			if (!div2_intro) {
    				add_render_callback(() => {
    					div2_intro = create_in_transition(div2, fade, { duration: 2000 });
    					div2_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Education', slots, []);
    	let lang = localStorage.getItem("LANG");
    	if (lang === "ES") lang = ES$4; else lang = EN$4;
    	let { data, main, header, goto, by } = lang;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Education> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fade,
    		Card: EducationCard,
    		EN: EN$4,
    		ES: ES$4,
    		lang,
    		data,
    		main,
    		header,
    		goto,
    		by
    	});

    	$$self.$inject_state = $$props => {
    		if ('lang' in $$props) lang = $$props.lang;
    		if ('data' in $$props) $$invalidate(4, data = $$props.data);
    		if ('main' in $$props) $$invalidate(0, main = $$props.main);
    		if ('header' in $$props) $$invalidate(1, header = $$props.header);
    		if ('goto' in $$props) $$invalidate(2, goto = $$props.goto);
    		if ('by' in $$props) $$invalidate(3, by = $$props.by);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [main, header, goto, by, data];
    }

    class Education extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Education",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\ExperienceCard.svelte generated by Svelte v3.44.1 */
    const file$7 = "src\\components\\ExperienceCard.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (14:4) {#if data.image}
    function create_if_block_7$1(ctx) {
    	let await_block_anchor;
    	let promise;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$3,
    		then: create_then_block$3,
    		catch: create_catch_block$3,
    		value: 5
    	};

    	handle_promise(promise = preload(/*data*/ ctx[0].image), info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*data*/ 1 && promise !== (promise = preload(/*data*/ ctx[0].image)) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			transition_in(info.block);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(14:4) {#if data.image}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { fade, blur }
    function create_catch_block$3(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$3.name,
    		type: "catch",
    		source: "(1:0) <script>   import { fade, blur }",
    		ctx
    	});

    	return block;
    }

    // (15:40)         <img         src={data.image}
    function create_then_block$3(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_intro;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*data*/ ctx[0].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*data*/ ctx[0].key);
    			attr_dev(img, "class", "image svelte-14bz6ak");
    			add_location(img, file$7, 15, 6, 406);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && !src_url_equal(img.src, img_src_value = /*data*/ ctx[0].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*data*/ 1 && img_alt_value !== (img_alt_value = /*data*/ ctx[0].key)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		i: function intro(local) {
    			if (!img_intro) {
    				add_render_callback(() => {
    					img_intro = create_in_transition(img, blur, { duration: 2000 });
    					img_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$3.name,
    		type: "then",
    		source: "(15:40)         <img         src={data.image}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { fade, blur }
    function create_pending_block$3(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$3.name,
    		type: "pending",
    		source: "(1:0) <script>   import { fade, blur }",
    		ctx
    	});

    	return block;
    }

    // (26:4) {#if data.title}
    function create_if_block_6$1(ctx) {
    	let h2;
    	let t_value = /*data*/ ctx[0].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(t_value);
    			attr_dev(h2, "class", "svelte-14bz6ak");
    			add_location(h2, file$7, 26, 5, 641);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*data*/ ctx[0].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(26:4) {#if data.title}",
    		ctx
    	});

    	return block;
    }

    // (29:4) {#if data.subtitle}
    function create_if_block_5$1(ctx) {
    	let h4;
    	let t_value = /*data*/ ctx[0].subtitle + "";
    	let t;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t = text(t_value);
    			attr_dev(h4, "class", "svelte-14bz6ak");
    			add_location(h4, file$7, 29, 5, 705);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*data*/ ctx[0].subtitle + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(29:4) {#if data.subtitle}",
    		ctx
    	});

    	return block;
    }

    // (32:4) {#if data.date}
    function create_if_block_4$2(ctx) {
    	let h3;
    	let t_value = /*data*/ ctx[0].date + "";
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(t_value);
    			attr_dev(h3, "class", "svelte-14bz6ak");
    			add_location(h3, file$7, 32, 5, 768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*data*/ ctx[0].date + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(32:4) {#if data.date}",
    		ctx
    	});

    	return block;
    }

    // (35:4) {#if data.note}
    function create_if_block_3$2(ctx) {
    	let p;
    	let t_value = /*data*/ ctx[0].note + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "note svelte-14bz6ak");
    			add_location(p, file$7, 35, 5, 827);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*data*/ ctx[0].note + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(35:4) {#if data.note}",
    		ctx
    	});

    	return block;
    }

    // (40:2) {#if data.roles}
    function create_if_block_2$2(ctx) {
    	let div;
    	let each_value = /*data*/ ctx[0].roles;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "roles svelte-14bz6ak");
    			add_location(div, file$7, 40, 3, 915);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1) {
    				each_value = /*data*/ ctx[0].roles;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(40:2) {#if data.roles}",
    		ctx
    	});

    	return block;
    }

    // (42:4) {#each data.roles as role}
    function create_each_block$5(ctx) {
    	let p;
    	let t_value = /*role*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "svelte-14bz6ak");
    			add_location(p, file$7, 42, 5, 973);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*role*/ ctx[2] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(42:4) {#each data.roles as role}",
    		ctx
    	});

    	return block;
    }

    // (47:2) {#if data.description}
    function create_if_block_1$2(ctx) {
    	let p;
    	let t_value = /*data*/ ctx[0].description + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "svelte-14bz6ak");
    			add_location(p, file$7, 47, 3, 1050);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*data*/ ctx[0].description + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(47:2) {#if data.description}",
    		ctx
    	});

    	return block;
    }

    // (50:2) {#if data.link && data.alias}
    function create_if_block$3(ctx) {
    	let a;
    	let t0;
    	let t1;
    	let span;
    	let t2_value = /*data*/ ctx[0].alias + "";
    	let t2;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(/*goto*/ ctx[1]);
    			t1 = space();
    			span = element("span");
    			t2 = text(t2_value);
    			attr_dev(span, "class", "svelte-14bz6ak");
    			add_location(span, file$7, 50, 30, 1149);
    			attr_dev(a, "href", a_href_value = /*data*/ ctx[0].link);
    			attr_dev(a, "class", "svelte-14bz6ak");
    			add_location(a, file$7, 50, 3, 1122);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			append_dev(a, span);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*goto*/ 2) set_data_dev(t0, /*goto*/ ctx[1]);
    			if (dirty & /*data*/ 1 && t2_value !== (t2_value = /*data*/ ctx[0].alias + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*data*/ 1 && a_href_value !== (a_href_value = /*data*/ ctx[0].link)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(50:2) {#if data.link && data.alias}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let if_block0 = /*data*/ ctx[0].image && create_if_block_7$1(ctx);
    	let if_block1 = /*data*/ ctx[0].title && create_if_block_6$1(ctx);
    	let if_block2 = /*data*/ ctx[0].subtitle && create_if_block_5$1(ctx);
    	let if_block3 = /*data*/ ctx[0].date && create_if_block_4$2(ctx);
    	let if_block4 = /*data*/ ctx[0].note && create_if_block_3$2(ctx);
    	let if_block5 = /*data*/ ctx[0].roles && create_if_block_2$2(ctx);
    	let if_block6 = /*data*/ ctx[0].description && create_if_block_1$2(ctx);
    	let if_block7 = /*data*/ ctx[0].link && /*data*/ ctx[0].alias && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			if (if_block5) if_block5.c();
    			t5 = space();
    			if (if_block6) if_block6.c();
    			t6 = space();
    			if (if_block7) if_block7.c();
    			attr_dev(div0, "class", "col-6 centered");
    			add_location(div0, file$7, 12, 3, 306);
    			attr_dev(div1, "class", "col-6 centered data-container svelte-14bz6ak");
    			add_location(div1, file$7, 24, 3, 569);
    			attr_dev(div2, "class", "title-container svelte-14bz6ak");
    			add_location(div2, file$7, 11, 2, 272);
    			attr_dev(div3, "class", "container svelte-14bz6ak");
    			add_location(div3, file$7, 10, 1, 245);
    			attr_dev(div4, "class", "col-6");
    			add_location(div4, file$7, 9, 0, 223);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t1);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t2);
    			if (if_block3) if_block3.m(div1, null);
    			append_dev(div1, t3);
    			if (if_block4) if_block4.m(div1, null);
    			append_dev(div3, t4);
    			if (if_block5) if_block5.m(div3, null);
    			append_dev(div3, t5);
    			if (if_block6) if_block6.m(div3, null);
    			append_dev(div3, t6);
    			if (if_block7) if_block7.m(div3, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*data*/ ctx[0].image) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*data*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_7$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*data*/ ctx[0].title) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_6$1(ctx);
    					if_block1.c();
    					if_block1.m(div1, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*data*/ ctx[0].subtitle) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_5$1(ctx);
    					if_block2.c();
    					if_block2.m(div1, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*data*/ ctx[0].date) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_4$2(ctx);
    					if_block3.c();
    					if_block3.m(div1, t3);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*data*/ ctx[0].note) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_3$2(ctx);
    					if_block4.c();
    					if_block4.m(div1, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*data*/ ctx[0].roles) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_2$2(ctx);
    					if_block5.c();
    					if_block5.m(div3, t5);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*data*/ ctx[0].description) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_1$2(ctx);
    					if_block6.c();
    					if_block6.m(div3, t6);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*data*/ ctx[0].link && /*data*/ ctx[0].alias) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block$3(ctx);
    					if_block7.c();
    					if_block7.m(div3, null);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}
    		},
    		i: function intro(local) {
    			transition_in(if_block0);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExperienceCard', slots, []);
    	let { data = null } = $$props;
    	let { goto = "go to" } = $$props;
    	const writable_props = ['data', 'goto'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExperienceCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('goto' in $$props) $$invalidate(1, goto = $$props.goto);
    	};

    	$$self.$capture_state = () => ({ fade, blur, preload, Link: Link$1, data, goto });

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('goto' in $$props) $$invalidate(1, goto = $$props.goto);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, goto];
    }

    class ExperienceCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { data: 0, goto: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExperienceCard",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get data() {
    		throw new Error("<ExperienceCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<ExperienceCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get goto() {
    		throw new Error("<ExperienceCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set goto(value) {
    		throw new Error("<ExperienceCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var main$1={university:"Technological Institute of Morelia",degree:"Computer Systems Engineer"};var data$1=[{key:1,title:"Softtek",subtitle:"Vulnerability Management & Security Operations Center",image:"/Portfolium//images/softtek.png",description:"Nowadays, I'm working as Vulnerability Manager & SOC member on Softtek. I collaborate with multiple teams to lead to vulnerability remediation to enhance customer security. Also, I focus on security research by using internal security tools to identify security risks and possible breaches.",date:"2023 - Today",link:"https://softtek.com",alias:"Softtek",roles:["VulnerabilityManagement","Cybersecurity","SecurityOperationsCenter"]},{key:2,title:"FLEX",subtitle:"IT Security Analyst",image:"/Portfolium//images/flex.png",description:"I started as Student on practices and growth as IT Security Analyst. Also, I made multiple contributions on internal processes automation, internal security audits, cloud services management and operations, data analysis, and more.",date:"2022 - 2023",link:"https://flex.com",alias:"FLEX",roles:["InternalAudits","Cybersecurity","Automation","SecurityManagement"]},{key:3,title:"DIINCO",subtitle:"Full-stack engineer & Security SysAdmin",image:"/Portfolium//images/diinco.png",description:"DIINCO is a startup that provides web-based management tools for infrastructure projects. I have collaborate on this project as full stack engineer since the team foundation. I have also collaborated with the team providing training to new members, integrating security implementations at company level. Also, on services operations and management.",date:"2021 - 2022",link:"diinco.com",alias:"DIINCO",roles:["FullstackEngineer","DevelopmentLeader","SecurityPlanning"]},{key:4,title:"El Tepetate",subtitle:"FullStack Developer",image:"/Portfolium//images/eltepetate.png",description:"As project for the Academic Software Factory of the Instituto Tecnológico de Morelia, we made a web technologies based administration platform for the trout farm El Tepetate. This project took part of a engineering contest on the institution.",date:"2019 - 2020",link:"https://www.granjadetruchas.com/",alias:"el tepetate",roles:["FullStackDeveloper","TeamLeader","Designer"],note:"Academic Software Factory"},{key:5,title:"Administrative Engineering Master",subtitle:"Frontend Developer",image:"/Portfolium//images/mia.png",description:"As social service project, my teammate devcydo and me, made the presentation web page for the Administrative Engineering Master at the Instituto Tecnológico de Morelia. Also, we made software and hardware maintenance to the Industrial Engineering computer laboratory and we also made an introductory manual to statístic analysis with Python.",date:"2021",link:"https://morelia.tecnm.mx/mia/",alias:"MIA",roles:["FrontendDeveloper","Designer"],note:"Social Service Project"}];var header$5="EXPERIENCE";var goto$1="go to";var description$1=["I'm a cybersecurity professional with experience in multiple areas, including Security Operations Center (SOC) management, Vulnerability Management, and Cloud Security Analysis. I've also developed skills as a full-stack developer, which has allowed me to collaborate on the development of tools for security management and automation. Additionally, I've gained hands-on experience designing and developing security-related tools and scripts, which has helped me understand the technical aspects of cybersecurity and how to effectively implement security solutions.","As a member of a SOC team, I've worked closely with IT teams to implement and manage various security tools, including EDR, SIEM, and CASB. I've also gained experience in Vulnerability Management and Cloud Security Auditing, implementing and evaluating different security controls and tools like Vulnerability Scanners and WAF.","I'm familiar with industry-recognized security frameworks and standards, such as ISO 27001, PCI DSS, CSA CCM, NIST CSF, and CIS recommendations. I've worked closely with organizations to implement and manage their security programs aligned to these frameworks, and I'm committed to continuously learning and growing in the field of cybersecurity."];var ctools$1=["Vulnerability Scanners","Endpoint Detection and Response (EDR)","Security Information and Event Management (SIEM)","Web Application Firewall (WAF)","Multi-purpose Cloud Security Management tools","Cloud Security Posture Management (CSPM)","Cloud Access Security Broker (CASB)","Penetration testing Suite tools"];var EN$3 = {main:main$1,data:data$1,header:header$5,goto:goto$1,description:description$1,ctools:ctools$1};

    var main={university:"Instituto Tecnológico de Morelia",degree:"Ingeniero en Sistemas Computacionales"};var data=[{key:1,title:"Softtek",subtitle:"Gestión de vulnerabilidades y Centro de Operaciones de Seguridad",image:"/Portfolium//images/softtek.png",description:"Actualmente, estoy trabajando como Analista de Vulnerabilidades y miembro del Centro de Operaciones de Seguridad en Softtek. Colaboro con múltiples equipos para liderar la remediación de vulnerabilidades y mejorar la seguridad de los clientes. Además, me enfoco en la investigación de seguridad utilizando herramientas de seguridad internas para identificar riesgos y posibles violaciones de seguridad.",date:"2023 - Hoy",link:"https://softtek.com",alias:"FLEX",roles:["GestiónDeVulnerabilidades","Ciberseguridad","CentroDeOperacionesDeSeguridad"]},{key:2,title:"FLEX",subtitle:"Analista de Seguridad Informática",image:"/Portfolium//images/flex.png",description:"Comencé como estudiante en prácticas y crecí como Analista de Seguridad Informática. También realicé múltiples contribuciones en la automatización de procesos internos, auditorías de seguridad internas, gestión y operaciones de servicios en la nube, análisis de datos y más.",date:"2022 - 2023",link:"https://flex.com",alias:"FLEX",roles:["AuditoríasInternas","Ciberseguridad","Automatización","AdministraciónDeSeguridad"]},{key:3,title:"DIINCO",subtitle:"Ingeniero Full-stack & Administrador de Seguridad",image:"/Portfolium//images/diinco.png",description:"DIINCO es una startup que proveé herramientas informáticas para la gestión de proyectos de infrastructura. He colaborado en este proyecto como ingeniero full-stack desde la fundación del equipo. Actualmente, colaboro con el equipo entrenando a nuevos miembros, integrando prácticas y herramientas de seguridad a nivel compañía. Además, en la operación y administración de servicios.",date:"2021 - 2022",link:"https://diinco.com",alias:"DIINCO",roles:["DesarrolladorFullstack","LiderDeDesarrollo","PlaneaciónDeSeguridad"]},{key:4,title:"El Tepetate",subtitle:"Desarrollador FullStack",image:"/Portfolium//images/eltepetate.png",description:"Como proyecto de la Fábrica Académica de Software del Instituto Tecnológico de Morelia, realizamos una plataforma de administración para la granja trutícola El tepetate, basada en tecnologías web. Este proyecto formó parte de un concurso de ingeniería dentro de la institución.",date:"2019 - 2020",link:"https://www.granjadetruchas.com/",alias:"el tepetate",roles:["DesarrolladorFullStack","LíderDeEquipo","Diseñador"],note:"Fábrica Académica de Software"},{key:5,title:"Maestría en Ingeniería Administrativa",subtitle:"Desarrollador Frontend",image:"/Portfolium//images/mia.png",description:"Como proyecto de servicio social, mi compañero devcydo y yo, nos encargamos de la página de presentación de la Maestría en Ingeniería Administrativa del Instituto Tecnológico de Morelia. Además de este proyecto, realizamos mantenimiento de software y hardware al equipo de computo del laboratorio de Ingeniería Industrial y realizamos un manual de introducción al análisis estadístico con Python.",date:"2021",link:"https://morelia.tecnm.mx/mia/",alias:"MIA",roles:["DesarrolladorFrontend","Diseñador"],note:"Proyecto de Servicio Social"}];var header$4="Experiencia";var goto="ir a";var description=["Soy un profesional en ciberseguridad con experiencia en múltiples áreas, incluyendo gestión de centros de operaciones de seguridad (SOC), gestión de vulnerabilidades y análisis de seguridad en la nube. También he desarrollado habilidades como desarrollador full-stack, lo que me ha permitido colaborar en el desarrollo de herramientas para la gestión de seguridad y automatización. Además, tengo experiencia práctica diseñando y desarrollando herramientas y scripts relacionados con la seguridad, lo que me ha ayudado a entender los aspectos técnicos de la ciberseguridad y cómo implementar eficazmente soluciones de seguridad.","Como miembro del equipo de un SOC, he trabajado estrechamente con equipos IT para implementar y gestionar herramientas de seguridad como EDR, SIEM y CASB. También tengo experiencia en gestión de vulnerabilidades y auditoría de seguridad en la nube, implementando y evaluando diferentes controles y herramientas de seguridad como escáneres de vulnerabilidades y WAF.","Estoy familiarizado con los marcos y estándares de ciberseguridad reconocidos a nivel internacional, como ISO 27001, PCI DSS, CSA CCM, NIST CSF y recomendaciones de CIS. He trabajado estrechamente con organizaciones para implementar y gestionar sus programas de seguridad alineados con estos marcos, y estoy comprometido a seguir aprendiendo y creciendo en el campo de la ciberseguridad."];var ctools=["Vulnerability Scanners","Endpoint Detection and Response (EDR)","Security Information and Event Management (SIEM)","Web Application Firewall (WAF)","Multi-purpose Cloud Security Management tools","Cloud Security Posture Management (CSPM)","Cloud Access Security Broker (CASB)","Penetration testing Suite tools"];var ES$3 = {main:main,data:data,header:header$4,goto:goto,description:description,ctools:ctools};

    /* src\routes\Experience.svelte generated by Svelte v3.44.1 */
    const file$6 = "src\\routes\\Experience.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (19:3) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("About Cybersecurity");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(19:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:3) {#if lang === ES}
    function create_if_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Acerca de Ciberseguridad");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(17:3) {#if lang === ES}",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#each description as paragraph, i}
    function create_each_block_2$1(ctx) {
    	let p;
    	let t_value = /*paragraph*/ ctx[12] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "svelte-satcw4");
    			add_location(p, file$6, 23, 3, 636);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(23:2) {#each description as paragraph, i}",
    		ctx
    	});

    	return block;
    }

    // (28:4) {#each ctools as tool, i}
    function create_each_block_1$1(ctx) {
    	let li;
    	let t_value = /*tool*/ ctx[9] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-satcw4");
    			add_location(li, file$6, 28, 5, 744);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(28:4) {#each ctools as tool, i}",
    		ctx
    	});

    	return block;
    }

    // (36:2) {#each data as data (data.key)}
    function create_each_block$4(key_1, ctx) {
    	let first;
    	let card;
    	let current;

    	card = new ExperienceCard({
    			props: {
    				data: /*data*/ ctx[5],
    				goto: /*goto*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(card.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(36:2) {#each data as data (data.key)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div4;
    	let h1;
    	let t1;
    	let div1;
    	let h2;
    	let t2;
    	let t3;
    	let div0;
    	let ul;
    	let t4;
    	let div2;
    	let t5;
    	let div3;
    	let each_blocks = [];
    	let each2_lookup = new Map();
    	let div4_intro;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*lang*/ ctx[0] === ES$3) return create_if_block$2;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);
    	let each_value_2 = /*description*/ ctx[3];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*ctools*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*data*/ ctx[5];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*data*/ ctx[5].key;
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each2_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			h1 = element("h1");
    			h1.textContent = `${/*header*/ ctx[1]}`;
    			t1 = space();
    			div1 = element("div");
    			h2 = element("h2");
    			if_block.c();
    			t2 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t3 = space();
    			div0 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();
    			div2 = element("div");
    			t5 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$6, 13, 1, 431);
    			add_location(h2, file$6, 15, 2, 480);
    			add_location(ul, file$6, 26, 3, 702);
    			attr_dev(div0, "class", "data-container svelte-satcw4");
    			add_location(div0, file$6, 25, 2, 669);
    			attr_dev(div1, "class", "description svelte-satcw4");
    			add_location(div1, file$6, 14, 1, 451);
    			attr_dev(div2, "class", "divider svelte-satcw4");
    			add_location(div2, file$6, 33, 1, 804);
    			attr_dev(div3, "class", "container svelte-satcw4");
    			add_location(div3, file$6, 34, 1, 830);
    			attr_dev(div4, "class", "fscreen");
    			add_location(div4, file$6, 12, 0, 378);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, h1);
    			append_dev(div4, t1);
    			append_dev(div4, div1);
    			append_dev(div1, h2);
    			if_block.m(h2, null);
    			append_dev(div1, t2);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div1, null);
    			}

    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, ul);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul, null);
    			}

    			append_dev(div4, t4);
    			append_dev(div4, div2);
    			append_dev(div4, t5);
    			append_dev(div4, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(h2, null);
    				}
    			}

    			if (dirty & /*description*/ 8) {
    				each_value_2 = /*description*/ ctx[3];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2$1(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(div1, t3);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*ctools*/ 16) {
    				each_value_1 = /*ctools*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*data, goto*/ 36) {
    				each_value = /*data*/ ctx[5];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each2_lookup, div3, outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			if (!div4_intro) {
    				add_render_callback(() => {
    					div4_intro = create_in_transition(div4, fade, { duration: 2000 });
    					div4_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if_block.d();
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Experience', slots, []);
    	let lang = localStorage.getItem("LANG");
    	if (lang === "ES") lang = ES$3; else lang = EN$3;
    	let { data, main, header, goto, description, ctools } = lang;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Experience> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fade,
    		Card: ExperienceCard,
    		EN: EN$3,
    		ES: ES$3,
    		lang,
    		data,
    		main,
    		header,
    		goto,
    		description,
    		ctools
    	});

    	$$self.$inject_state = $$props => {
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    		if ('data' in $$props) $$invalidate(5, data = $$props.data);
    		if ('main' in $$props) main = $$props.main;
    		if ('header' in $$props) $$invalidate(1, header = $$props.header);
    		if ('goto' in $$props) $$invalidate(2, goto = $$props.goto);
    		if ('description' in $$props) $$invalidate(3, description = $$props.description);
    		if ('ctools' in $$props) $$invalidate(4, ctools = $$props.ctools);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lang, header, goto, description, ctools, data];
    }

    class Experience extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Experience",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\DemoCard.svelte generated by Svelte v3.44.1 */

    const { console: console_1$1 } = globals;
    const file$5 = "src\\components\\DemoCard.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (21:3) {#if data.title}
    function create_if_block_4$1(ctx) {
    	let h2;
    	let t_value = /*data*/ ctx[0].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(t_value);
    			attr_dev(h2, "class", "svelte-gzuz4g");
    			add_location(h2, file$5, 21, 4, 507);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*data*/ ctx[0].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(21:3) {#if data.title}",
    		ctx
    	});

    	return block;
    }

    // (24:3) {#if data.subtitle}
    function create_if_block_3$1(ctx) {
    	let h4;
    	let t_value = /*data*/ ctx[0].subtitle + "";
    	let t;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t = text(t_value);
    			attr_dev(h4, "class", "svelte-gzuz4g");
    			add_location(h4, file$5, 24, 4, 568);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*data*/ ctx[0].subtitle + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(24:3) {#if data.subtitle}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { fade, blur }
    function create_catch_block$2(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(1:0) <script>   import { fade, blur }",
    		ctx
    	});

    	return block;
    }

    // (30:34)        <img        src={image}
    function create_then_block$2(ctx) {
    	let img;
    	let img_src_value;
    	let img_class_value;
    	let img_intro;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[6])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*i*/ ctx[8]);

    			attr_dev(img, "class", img_class_value = "" + (null_to_empty(/*index*/ ctx[3] === /*i*/ ctx[8]
    			? "image active"
    			: "image inactive") + " svelte-gzuz4g"));

    			add_location(img, file$5, 30, 5, 724);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*switchImage*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[6])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*index*/ 8 && img_class_value !== (img_class_value = "" + (null_to_empty(/*index*/ ctx[3] === /*i*/ ctx[8]
    			? "image active"
    			: "image inactive") + " svelte-gzuz4g"))) {
    				attr_dev(img, "class", img_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (!img_intro) {
    				add_render_callback(() => {
    					img_intro = create_in_transition(img, blur, { duration: 2000 });
    					img_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(30:34)        <img        src={image}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { fade, blur }
    function create_pending_block$2(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(1:0) <script>   import { fade, blur }",
    		ctx
    	});

    	return block;
    }

    // (29:3) {#each data.images as image, i}
    function create_each_block$3(ctx) {
    	let await_block_anchor;
    	let promise;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 9
    	};

    	handle_promise(promise = preload(/*image*/ ctx[6]), info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*data*/ 1 && promise !== (promise = preload(/*image*/ ctx[6])) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			transition_in(info.block);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(29:3) {#each data.images as image, i}",
    		ctx
    	});

    	return block;
    }

    // (43:3) {#if data.description}
    function create_if_block_2$1(ctx) {
    	let p;
    	let t_value = /*data*/ ctx[0].description + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "svelte-gzuz4g");
    			add_location(p, file$5, 43, 4, 1066);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*data*/ ctx[0].description + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(43:3) {#if data.description}",
    		ctx
    	});

    	return block;
    }

    // (48:3) {#if data.repo_link}
    function create_if_block_1$1(ctx) {
    	let a;
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(/*repository*/ ctx[1]);
    			attr_dev(a, "href", a_href_value = /*data*/ ctx[0].repo_link);
    			attr_dev(a, "class", "svelte-gzuz4g");
    			add_location(a, file$5, 48, 4, 1174);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*repository*/ 2) set_data_dev(t, /*repository*/ ctx[1]);

    			if (dirty & /*data*/ 1 && a_href_value !== (a_href_value = /*data*/ ctx[0].repo_link)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(48:3) {#if data.repo_link}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#if data.demo_link}
    function create_if_block$1(ctx) {
    	let a;
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(/*demo*/ ctx[2]);
    			attr_dev(a, "href", a_href_value = /*data*/ ctx[0].demo_link);
    			attr_dev(a, "class", "svelte-gzuz4g");
    			add_location(a, file$5, 51, 4, 1256);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*demo*/ 4) set_data_dev(t, /*demo*/ ctx[2]);

    			if (dirty & /*data*/ 1 && a_href_value !== (a_href_value = /*data*/ ctx[0].demo_link)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(51:3) {#if data.demo_link}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div5;
    	let div4;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let span;
    	let t3_value = /*index*/ ctx[3] + 1 + "";
    	let t3;
    	let t4;
    	let t5_value = /*images*/ ctx[4].length + "";
    	let t5;
    	let t6;
    	let div2;
    	let t7;
    	let div3;
    	let t8;
    	let if_block0 = /*data*/ ctx[0].title && create_if_block_4$1(ctx);
    	let if_block1 = /*data*/ ctx[0].subtitle && create_if_block_3$1(ctx);
    	let each_value = /*data*/ ctx[0].images;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	let if_block2 = /*data*/ ctx[0].description && create_if_block_2$1(ctx);
    	let if_block3 = /*data*/ ctx[0].repo_link && create_if_block_1$1(ctx);
    	let if_block4 = /*data*/ ctx[0].demo_link && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			span = element("span");
    			t3 = text(t3_value);
    			t4 = text("/");
    			t5 = text(t5_value);
    			t6 = space();
    			div2 = element("div");
    			if (if_block2) if_block2.c();
    			t7 = space();
    			div3 = element("div");
    			if (if_block3) if_block3.c();
    			t8 = space();
    			if (if_block4) if_block4.c();
    			attr_dev(div0, "class", "header-container svelte-gzuz4g");
    			add_location(div0, file$5, 19, 2, 450);
    			attr_dev(span, "class", "image_index svelte-gzuz4g");
    			add_location(span, file$5, 39, 3, 931);
    			attr_dev(div1, "class", "title-container svelte-gzuz4g");
    			add_location(div1, file$5, 27, 2, 616);
    			attr_dev(div2, "class", "data-container svelte-gzuz4g");
    			add_location(div2, file$5, 41, 2, 1005);
    			attr_dev(div3, "class", "link-container svelte-gzuz4g");
    			add_location(div3, file$5, 46, 2, 1115);
    			attr_dev(div4, "class", "container svelte-gzuz4g");
    			add_location(div4, file$5, 18, 1, 423);
    			attr_dev(div5, "class", "col-4");
    			add_location(div5, file$5, 17, 0, 401);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div4, t1);
    			append_dev(div4, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t2);
    			append_dev(div1, span);
    			append_dev(span, t3);
    			append_dev(span, t4);
    			append_dev(span, t5);
    			append_dev(div4, t6);
    			append_dev(div4, div2);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			if (if_block3) if_block3.m(div3, null);
    			append_dev(div3, t8);
    			if (if_block4) if_block4.m(div3, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*data*/ ctx[0].title) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*data*/ ctx[0].subtitle) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3$1(ctx);
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*preload, data, index, switchImage*/ 41) {
    				each_value = /*data*/ ctx[0].images;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*index*/ 8 && t3_value !== (t3_value = /*index*/ ctx[3] + 1 + "")) set_data_dev(t3, t3_value);

    			if (/*data*/ ctx[0].description) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2$1(ctx);
    					if_block2.c();
    					if_block2.m(div2, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*data*/ ctx[0].repo_link) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_1$1(ctx);
    					if_block3.c();
    					if_block3.m(div3, t8);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*data*/ ctx[0].demo_link) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block$1(ctx);
    					if_block4.c();
    					if_block4.m(div3, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}
    		},
    		i: function intro(local) {
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DemoCard', slots, []);
    	let { data = null } = $$props;
    	let { repository = "repository" } = $$props;
    	let { demo = "try demo" } = $$props;
    	let images = data.images;
    	let index = 0;

    	function switchImage() {
    		if (index < images.length - 1) $$invalidate(3, index++, index); else $$invalidate(3, index = 0);
    		console.log(index, images.length);
    	}

    	const writable_props = ['data', 'repository', 'demo'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<DemoCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('repository' in $$props) $$invalidate(1, repository = $$props.repository);
    		if ('demo' in $$props) $$invalidate(2, demo = $$props.demo);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		blur,
    		preload,
    		data,
    		repository,
    		demo,
    		images,
    		index,
    		switchImage
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('repository' in $$props) $$invalidate(1, repository = $$props.repository);
    		if ('demo' in $$props) $$invalidate(2, demo = $$props.demo);
    		if ('images' in $$props) $$invalidate(4, images = $$props.images);
    		if ('index' in $$props) $$invalidate(3, index = $$props.index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, repository, demo, index, images, switchImage];
    }

    class DemoCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { data: 0, repository: 1, demo: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DemoCard",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get data() {
    		throw new Error("<DemoCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<DemoCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get repository() {
    		throw new Error("<DemoCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set repository(value) {
    		throw new Error("<DemoCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get demo() {
    		throw new Error("<DemoCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set demo(value) {
    		throw new Error("<DemoCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var demos$3=[{key:1,title:"Socket Chat",subtitle:"Real time chat",images:["/Portfolium//screenshots/SocketChat.png","/Portfolium//screenshots/SocketChat2.png"],description:"The web on real time functionalities are pretty important nowadays, a useful tool for this propose are web sockets. This demo is a Socket.IO implementation for a real time web chat.",repo_link:"https://github.com/larapa99/SocketChat"},{key:2,title:"Python Cypher Tool",subtitle:"Didactic encryption tool",images:["/Portfolium//screenshots/Cypher.png","/Portfolium//screenshots/Cypher2.png"],description:"One of the most important topics on Cybersecurity is the cryptography, this tool presents an implementation of some weak encryption algorithms so that they are easy to understand, this program was created for educational purposes.",repo_link:"https://github.com/larapa99/Cypher"},{key:3,title:"AQUATA",subtitle:"Trout farm administrative platform",images:["/Portfolium//screenshots/aquata.png","/Portfolium//screenshots/aquata2.png","/Portfolium//screenshots/aquata3.png","/Portfolium//screenshots/aquata4.png","/Portfolium//screenshots/aquata5.png","/Portfolium//screenshots/aquata6.png","/Portfolium//screenshots/aquata7.png"],description:"This project is part of my experience working with the trout farm El Tepetate, it was part of the contest of Academic Software Factory of the Technological Institute of Morelia in the period January-July 2020. With this platform we obtained the 1st place tying with the Dragonware Team",repo_link:"https://gitlab.com/larapa/aquata-2.0"}];var header$3="Demos";var repository$1="repository";var EN$2 = {demos:demos$3,header:header$3,repository:repository$1,"try":"try it!"};

    var demos$2=[{key:1,title:"Socket Chat",subtitle:"Chat en tiempo real",images:["/Portfolium//screenshots/SocketChat.png","/Portfolium//screenshots/SocketChat2.png"],description:"Las funciones de la web en tiempo real son muy importantes hoy en día, una herramienta útil para este propósito son los web sockets. Este demo es una implementación básica de Socket.IO para una aplicación web de chat en tiempo real.",repo_link:"https://github.com/larapa99/SocketChat"},{key:2,title:"Python Cypher Tool",subtitle:"Herramienta didáctica de cifrado",images:["/Portfolium//screenshots/Cypher.png","/Portfolium//screenshots/Cypher2.png"],description:"Uno de los temas más importantes de la ciberseguridad es la criptografía, en esta herramienta se presenta la implementación de algunos algorítmos de cifrado débil de forma que sean fáciles de compreender, este programa fue elaborado con fines didácticos.",repo_link:"https://github.com/larapa99/Cypher"},{key:3,title:"AQUATA",subtitle:"Plataforma de administración de granja trutícola",images:["/Portfolium//screenshots/aquata.png","/Portfolium//screenshots/aquata2.png","/Portfolium//screenshots/aquata3.png","/Portfolium//screenshots/aquata4.png","/Portfolium//screenshots/aquata5.png","/Portfolium//screenshots/aquata6.png","/Portfolium//screenshots/aquata7.png"],description:"Este proyecto es parte de mi experiencia trabajando con la granja trutícola El Tepetate, formó parte de un concurso de la Fábrica Académica de Software del Instituto Tecnológico de Morelia en el periodo Enero-Julio 2020. Con esta plataforma obtuvimos el 1er lugar empatando con el equipo Dragonware.",repo_link:"https://gitlab.com/larapa/aquata-2.0"}];var header$2="Demos";var repository="repository";var ES$2 = {demos:demos$2,header:header$2,repository:repository,"try":"try it!"};

    /* src\routes\Demos.svelte generated by Svelte v3.44.1 */
    const file$4 = "src\\routes\\Demos.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (18:3) {#each demos as demo}
    function create_each_block$2(ctx) {
    	let democard;
    	let current;

    	democard = new DemoCard({
    			props: {
    				repository: /*repository*/ ctx[2],
    				demo: /*_demo*/ ctx[3],
    				data: /*demo*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(democard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(democard, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(democard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(democard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(democard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(18:3) {#each demos as demo}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div2;
    	let h1;
    	let t1;
    	let div1;
    	let div0;
    	let div2_intro;
    	let current;
    	let each_value = /*demos*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = `${/*header*/ ctx[1]}`;
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$4, 14, 1, 439);
    			attr_dev(div0, "class", "demos svelte-3zr6vs");
    			add_location(div0, file$4, 16, 2, 486);
    			attr_dev(div1, "class", "container svelte-3zr6vs");
    			add_location(div1, file$4, 15, 1, 459);
    			attr_dev(div2, "class", "fscreen");
    			add_location(div2, file$4, 13, 0, 386);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*repository, _demo, demos*/ 13) {
    				each_value = /*demos*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			if (!div2_intro) {
    				add_render_callback(() => {
    					div2_intro = create_in_transition(div2, fade, { duration: 2000 });
    					div2_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Demos', slots, []);
    	let lang = localStorage.getItem("LANG");
    	if (lang === "ES") lang = ES$2; else lang = EN$2;
    	let { demos, main, header, repository } = lang;
    	let _demo = lang.try;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Demos> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fade,
    		fly,
    		slide,
    		DemoCard,
    		EN: EN$2,
    		ES: ES$2,
    		lang,
    		demos,
    		main,
    		header,
    		repository,
    		_demo
    	});

    	$$self.$inject_state = $$props => {
    		if ('lang' in $$props) lang = $$props.lang;
    		if ('demos' in $$props) $$invalidate(0, demos = $$props.demos);
    		if ('main' in $$props) main = $$props.main;
    		if ('header' in $$props) $$invalidate(1, header = $$props.header);
    		if ('repository' in $$props) $$invalidate(2, repository = $$props.repository);
    		if ('_demo' in $$props) $$invalidate(3, _demo = $$props._demo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [demos, header, repository, _demo];
    }

    class Demos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Demos",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\ImageCard.svelte generated by Svelte v3.44.1 */
    const file$3 = "src\\components\\ImageCard.svelte";

    // (1:0) <script>   import { fade, blur }
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>   import { fade, blur }",
    		ctx
    	});

    	return block;
    }

    // (9:31)     <img     src={image}
    function create_then_block$1(ctx) {
    	let img;
    	let img_src_value;
    	let img_intro;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*image*/ ctx[0]);
    			attr_dev(img, "class", "image svelte-gm44ew");
    			add_location(img, file$3, 9, 2, 208);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*image*/ 1 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*image*/ 1) {
    				attr_dev(img, "alt", /*image*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (!img_intro) {
    				add_render_callback(() => {
    					img_intro = create_in_transition(img, blur, { duration: 2000 });
    					img_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(9:31)     <img     src={image}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { fade, blur }
    function create_pending_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(1:0) <script>   import { fade, blur }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let promise;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 1
    	};

    	handle_promise(promise = preload(/*image*/ ctx[0]), info);

    	const block = {
    		c: function create() {
    			div = element("div");
    			info.block.c();
    			attr_dev(div, "class", "col-4");
    			add_location(div, file$3, 7, 0, 152);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			info.block.m(div, info.anchor = null);
    			info.mount = () => div;
    			info.anchor = null;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*image*/ 1 && promise !== (promise = preload(/*image*/ ctx[0])) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			transition_in(info.block);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ImageCard', slots, []);
    	let { image = null } = $$props;
    	const writable_props = ['image'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ImageCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('image' in $$props) $$invalidate(0, image = $$props.image);
    	};

    	$$self.$capture_state = () => ({ fade, blur, preload, image });

    	$$self.$inject_state = $$props => {
    		if ('image' in $$props) $$invalidate(0, image = $$props.image);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [image];
    }

    class ImageCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { image: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ImageCard",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get image() {
    		throw new Error("<ImageCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<ImageCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ImageGroupCard.svelte generated by Svelte v3.44.1 */

    const { console: console_1 } = globals;
    const file$2 = "src\\components\\ImageGroupCard.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (1:0) <script>   import { fade, blur }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>   import { fade, blur }",
    		ctx
    	});

    	return block;
    }

    // (16:32)      <img      src={image}
    function create_then_block(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_class_value;
    	let img_intro;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*image*/ ctx[3]);

    			attr_dev(img, "class", img_class_value = "" + (null_to_empty(/*index*/ ctx[1] === /*i*/ ctx[5]
    			? "image active"
    			: "image inactive") + " svelte-cspszk"));

    			add_location(img, file$2, 16, 3, 392);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*switchImage*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*group*/ 1 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*group*/ 1 && img_alt_value !== (img_alt_value = /*image*/ ctx[3])) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*index*/ 2 && img_class_value !== (img_class_value = "" + (null_to_empty(/*index*/ ctx[1] === /*i*/ ctx[5]
    			? "image active"
    			: "image inactive") + " svelte-cspszk"))) {
    				attr_dev(img, "class", img_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (!img_intro) {
    				add_render_callback(() => {
    					img_intro = create_in_transition(img, blur, { duration: 2000 });
    					img_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(16:32)      <img      src={image}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { fade, blur }
    function create_pending_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(1:0) <script>   import { fade, blur }",
    		ctx
    	});

    	return block;
    }

    // (15:1) {#each group as image, i}
    function create_each_block$1(ctx) {
    	let await_block_anchor;
    	let promise;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 6
    	};

    	handle_promise(promise = preload(/*image*/ ctx[3]), info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*group*/ 1 && promise !== (promise = preload(/*image*/ ctx[3])) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			transition_in(info.block);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(15:1) {#each group as image, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let t0;
    	let span;
    	let t1_value = /*index*/ ctx[1] + 1 + "";
    	let t1;
    	let t2;
    	let t3_value = /*group*/ ctx[0].length + "";
    	let t3;
    	let each_value = /*group*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = text("/");
    			t3 = text(t3_value);
    			attr_dev(span, "class", "image_index svelte-cspszk");
    			add_location(span, file$2, 25, 1, 585);
    			attr_dev(div, "class", "col-4 container svelte-cspszk");
    			add_location(div, file$2, 13, 0, 296);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t0);
    			append_dev(div, span);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(span, t3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*preload, group, index, switchImage*/ 7) {
    				each_value = /*group*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*index*/ 2 && t1_value !== (t1_value = /*index*/ ctx[1] + 1 + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*group*/ 1 && t3_value !== (t3_value = /*group*/ ctx[0].length + "")) set_data_dev(t3, t3_value);
    		},
    		i: function intro(local) {
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ImageGroupCard', slots, []);
    	let { group = [] } = $$props;
    	let index = 0;

    	function switchImage() {
    		if (index < group.length - 1) $$invalidate(1, index++, index); else $$invalidate(1, index = 0);
    		console.log(index, group.length);
    	}

    	const writable_props = ['group'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<ImageGroupCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('group' in $$props) $$invalidate(0, group = $$props.group);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		blur,
    		preload,
    		group,
    		index,
    		switchImage
    	});

    	$$self.$inject_state = $$props => {
    		if ('group' in $$props) $$invalidate(0, group = $$props.group);
    		if ('index' in $$props) $$invalidate(1, index = $$props.index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [group, index, switchImage];
    }

    class ImageGroupCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { group: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ImageGroupCard",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get group() {
    		throw new Error("<ImageGroupCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<ImageGroupCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var gallery$1={images:[["/Portfolium//gallery/Covita/logo.jpg","/Portfolium//gallery/Covita/halloween.jpg","/Portfolium//gallery/Covita/birthday.jpg"],"/Portfolium//gallery/rose.jpg","/Portfolium//gallery/glider.png","/Portfolium//gallery/skull.jpg","/Portfolium//gallery/jack.jpg","/Portfolium//gallery/demon.jpg","/Portfolium//gallery/anime.jpg"],header:"Gallery",description:"On my free time I have made some digital drawing projects, I made the logo and mascot for @covita_bazar, this is a second hand e-bazar in Morelia. Also, I have made some graphic design projects. I consider digital drawing as one of my favorite hobbies since many years ago, next you can see some of the work I have made."};var hobbies$1={header:"Hobbies",description:"Besides my studies, programming and engineering; I have another hobbies that have helped to my personal growth in terms of skill and creativity, some of them are:",data:["digital drawing","latte art","videogames","electronics","philosophy and politics","cooking","Music"]};var interests$1={header:"Interests",subtitle:"I'm an Open Source Community enthusiast!",description:"Within the scope of informatics, I have affinity on the Open Source Community and its ethical values; I'm a GNU/LInux and AOSP enthusiast. Also, I have interest for the next topics:",data:["cibersecurity","operative systems","Game cheating development","low level programming","Arduino and RPi","Docker and Kubernetes","privacy","journalism and communication","cryptography","IT Ethics","Artificial Intelligence","many more..."]};var header$1="More";var EN$1 = {gallery:gallery$1,hobbies:hobbies$1,interests:interests$1,header:header$1};

    var gallery={images:[["/Portfolium//gallery/Covita/logo.jpg","/Portfolium//gallery/Covita/halloween.jpg","/Portfolium//gallery/Covita/birthday.jpg"],"/Portfolium//gallery/rose.jpg","/Portfolium//gallery/glider.png","/Portfolium//gallery/skull.jpg","/Portfolium//gallery/jack.jpg","/Portfolium//gallery/demon.jpg","/Portfolium//gallery/anime.jpg"],header:"Galería",description:"En mis tiempos libres he realizado diversos trabajos de dibujo digital, hice el logo y mascota de @covita_bazar, el cual es un bazar digital de ropa de segunda mano en Morelia. También he realizado algunos trabajos de diseño gráfico. Considero el dibujo digital uno de mis pasatiempos favoritos desde hace algunos años, a continuación podrá ver algunos de los trabajos que he realizado."};var hobbies={header:"Pasatiempos",description:"Adicional a mis estudios, la programación y la ingeniería; tengo otros pasatiempos que han ayudado a mi crecimiento personal en ámbito de destreza y creatividad, algunos de estos pasatiempos son:",data:["Dibujo digital","Baristería","Videojuegos","Electrónica","Filosofía y política","Cocina","Música"]};var interests={header:"Intereses personales",subtitle:"Soy un entusiasta de la comunidad del software libre",description:"Dentro del ámbito de la informática, tengo afinidad con la comunidad del software libre y sus valores; soy un entusiasta de GNU/Linux y AOSP. Además de ello, tengo interés por los siguientes temas:",data:["ciberseguridad","sistemas operativos","Desarrollo de cheats para videojuegos","Programación de bajo nivel","Arduino y RPi","Docker y Kubernetes","privacidad","periodismo y comunicación","Criptografía","Ética en TI","Inteligencia Artificial","entre otros..."]};var header="Más";var ES$1 = {gallery:gallery,hobbies:hobbies,interests:interests,header:header};

    /* src\routes\More.svelte generated by Svelte v3.44.1 */
    const file$1 = "src\\routes\\More.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (18:3) {#if hobbies.header}
    function create_if_block_12(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = `${/*hobbies*/ ctx[2].header}`;
    			attr_dev(h2, "class", "svelte-5y1dhd");
    			add_location(h2, file$1, 18, 4, 596);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(18:3) {#if hobbies.header}",
    		ctx
    	});

    	return block;
    }

    // (23:3) {#if hobbies.subtitle}
    function create_if_block_11(ctx) {
    	let h4;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = `${/*hobbies*/ ctx[2].subtitle}`;
    			attr_dev(h4, "class", "svelte-5y1dhd");
    			add_location(h4, file$1, 23, 4, 677);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(23:3) {#if hobbies.subtitle}",
    		ctx
    	});

    	return block;
    }

    // (26:3) {#if hobbies.description}
    function create_if_block_10(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = `${/*hobbies*/ ctx[2].description}`;
    			attr_dev(p, "class", "svelte-5y1dhd");
    			add_location(p, file$1, 26, 4, 750);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(26:3) {#if hobbies.description}",
    		ctx
    	});

    	return block;
    }

    // (30:4) {#if hobbies.data}
    function create_if_block_9(ctx) {
    	let ul;
    	let each_value_2 = /*hobbies*/ ctx[2].data;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(ul, file$1, 30, 5, 852);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hobbies*/ 4) {
    				each_value_2 = /*hobbies*/ ctx[2].data;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(30:4) {#if hobbies.data}",
    		ctx
    	});

    	return block;
    }

    // (32:6) {#each hobbies.data as hobbie}
    function create_each_block_2(ctx) {
    	let li;
    	let t_value = /*hobbie*/ ctx[11] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-5y1dhd");
    			add_location(li, file$1, 32, 7, 903);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(32:6) {#each hobbies.data as hobbie}",
    		ctx
    	});

    	return block;
    }

    // (40:3) {#if interests.header}
    function create_if_block_8(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = `${/*interests*/ ctx[3].header}`;
    			attr_dev(h2, "class", "svelte-5y1dhd");
    			add_location(h2, file$1, 40, 4, 1045);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(40:3) {#if interests.header}",
    		ctx
    	});

    	return block;
    }

    // (45:3) {#if interests.subtitle}
    function create_if_block_7(ctx) {
    	let h4;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = `${/*interests*/ ctx[3].subtitle}`;
    			attr_dev(h4, "class", "svelte-5y1dhd");
    			add_location(h4, file$1, 45, 4, 1130);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(45:3) {#if interests.subtitle}",
    		ctx
    	});

    	return block;
    }

    // (48:3) {#if interests.description}
    function create_if_block_6(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = `${/*interests*/ ctx[3].description}`;
    			attr_dev(p, "class", "svelte-5y1dhd");
    			add_location(p, file$1, 48, 4, 1207);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(48:3) {#if interests.description}",
    		ctx
    	});

    	return block;
    }

    // (52:4) {#if interests.data}
    function create_if_block_5(ctx) {
    	let ul;
    	let each_value_1 = /*interests*/ ctx[3].data;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(ul, file$1, 52, 5, 1313);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*interests*/ 8) {
    				each_value_1 = /*interests*/ ctx[3].data;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(52:4) {#if interests.data}",
    		ctx
    	});

    	return block;
    }

    // (54:6) {#each interests.data as interest}
    function create_each_block_1(ctx) {
    	let li;
    	let t_value = /*interest*/ ctx[8] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-5y1dhd");
    			add_location(li, file$1, 54, 7, 1368);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(54:6) {#each interests.data as interest}",
    		ctx
    	});

    	return block;
    }

    // (62:3) {#if gallery.header}
    function create_if_block_4(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = `${/*gallery*/ ctx[0].header}`;
    			attr_dev(h2, "class", "svelte-5y1dhd");
    			add_location(h2, file$1, 62, 4, 1510);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(62:3) {#if gallery.header}",
    		ctx
    	});

    	return block;
    }

    // (67:3) {#if gallery.subtitle}
    function create_if_block_3(ctx) {
    	let h4;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = `${/*gallery*/ ctx[0].subtitle}`;
    			attr_dev(h4, "class", "svelte-5y1dhd");
    			add_location(h4, file$1, 67, 4, 1591);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(67:3) {#if gallery.subtitle}",
    		ctx
    	});

    	return block;
    }

    // (70:3) {#if gallery.description}
    function create_if_block_2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = `${/*gallery*/ ctx[0].description}`;
    			attr_dev(p, "class", "svelte-5y1dhd");
    			add_location(p, file$1, 70, 4, 1664);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(70:3) {#if gallery.description}",
    		ctx
    	});

    	return block;
    }

    // (78:41) 
    function create_if_block_1(ctx) {
    	let imagegroupcard;
    	let current;

    	imagegroupcard = new ImageGroupCard({
    			props: { group: /*image*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(imagegroupcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(imagegroupcard, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(imagegroupcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(imagegroupcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(imagegroupcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(78:41) ",
    		ctx
    	});

    	return block;
    }

    // (76:4) {#if typeof image === typeof ""}
    function create_if_block(ctx) {
    	let imagecard;
    	let current;

    	imagecard = new ImageCard({
    			props: { image: /*image*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(imagecard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(imagecard, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(imagecard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(imagecard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(imagecard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(76:4) {#if typeof image === typeof \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (75:3) {#each gallery.images as image}
    function create_each_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (typeof /*image*/ ctx[5] === typeof "") return 0;
    		if (typeof /*image*/ ctx[5] === typeof []) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (if_block) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(75:3) {#each gallery.images as image}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div7;
    	let h1;
    	let t1;
    	let div6;
    	let div1;
    	let t2;
    	let t3;
    	let t4;
    	let div0;
    	let t5;
    	let div3;
    	let t6;
    	let t7;
    	let t8;
    	let div2;
    	let t9;
    	let div4;
    	let t10;
    	let t11;
    	let t12;
    	let div5;
    	let div7_intro;
    	let current;
    	let if_block0 = /*hobbies*/ ctx[2].header && create_if_block_12(ctx);
    	let if_block1 = /*hobbies*/ ctx[2].subtitle && create_if_block_11(ctx);
    	let if_block2 = /*hobbies*/ ctx[2].description && create_if_block_10(ctx);
    	let if_block3 = /*hobbies*/ ctx[2].data && create_if_block_9(ctx);
    	let if_block4 = /*interests*/ ctx[3].header && create_if_block_8(ctx);
    	let if_block5 = /*interests*/ ctx[3].subtitle && create_if_block_7(ctx);
    	let if_block6 = /*interests*/ ctx[3].description && create_if_block_6(ctx);
    	let if_block7 = /*interests*/ ctx[3].data && create_if_block_5(ctx);
    	let if_block8 = /*gallery*/ ctx[0].header && create_if_block_4(ctx);
    	let if_block9 = /*gallery*/ ctx[0].subtitle && create_if_block_3(ctx);
    	let if_block10 = /*gallery*/ ctx[0].description && create_if_block_2(ctx);
    	let each_value = /*gallery*/ ctx[0].images;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			h1 = element("h1");
    			h1.textContent = `${/*header*/ ctx[1]}`;
    			t1 = space();
    			div6 = element("div");
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			div0 = element("div");
    			if (if_block3) if_block3.c();
    			t5 = space();
    			div3 = element("div");
    			if (if_block4) if_block4.c();
    			t6 = space();
    			if (if_block5) if_block5.c();
    			t7 = space();
    			if (if_block6) if_block6.c();
    			t8 = space();
    			div2 = element("div");
    			if (if_block7) if_block7.c();
    			t9 = space();
    			div4 = element("div");
    			if (if_block8) if_block8.c();
    			t10 = space();
    			if (if_block9) if_block9.c();
    			t11 = space();
    			if (if_block10) if_block10.c();
    			t12 = space();
    			div5 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$1, 14, 1, 489);
    			attr_dev(div0, "class", "data-container svelte-5y1dhd");
    			add_location(div0, file$1, 28, 3, 793);
    			attr_dev(div1, "class", "title-container svelte-5y1dhd");
    			add_location(div1, file$1, 16, 2, 536);
    			attr_dev(div2, "class", "data-container svelte-5y1dhd");
    			add_location(div2, file$1, 50, 3, 1252);
    			attr_dev(div3, "class", "title-container svelte-5y1dhd");
    			add_location(div3, file$1, 38, 2, 983);
    			attr_dev(div4, "class", "title-container svelte-5y1dhd");
    			add_location(div4, file$1, 60, 2, 1450);
    			attr_dev(div5, "class", "image-container svelte-5y1dhd");
    			add_location(div5, file$1, 73, 2, 1716);
    			attr_dev(div6, "class", "container svelte-5y1dhd");
    			add_location(div6, file$1, 15, 1, 509);
    			attr_dev(div7, "class", "fscreen");
    			add_location(div7, file$1, 13, 0, 436);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, h1);
    			append_dev(div7, t1);
    			append_dev(div7, div6);
    			append_dev(div6, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t2);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t3);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			if (if_block3) if_block3.m(div0, null);
    			append_dev(div6, t5);
    			append_dev(div6, div3);
    			if (if_block4) if_block4.m(div3, null);
    			append_dev(div3, t6);
    			if (if_block5) if_block5.m(div3, null);
    			append_dev(div3, t7);
    			if (if_block6) if_block6.m(div3, null);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			if (if_block7) if_block7.m(div2, null);
    			append_dev(div6, t9);
    			append_dev(div6, div4);
    			if (if_block8) if_block8.m(div4, null);
    			append_dev(div4, t10);
    			if (if_block9) if_block9.m(div4, null);
    			append_dev(div4, t11);
    			if (if_block10) if_block10.m(div4, null);
    			append_dev(div6, t12);
    			append_dev(div6, div5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div5, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*hobbies*/ ctx[2].header) if_block0.p(ctx, dirty);
    			if (/*hobbies*/ ctx[2].subtitle) if_block1.p(ctx, dirty);
    			if (/*hobbies*/ ctx[2].description) if_block2.p(ctx, dirty);
    			if (/*hobbies*/ ctx[2].data) if_block3.p(ctx, dirty);
    			if (/*interests*/ ctx[3].header) if_block4.p(ctx, dirty);
    			if (/*interests*/ ctx[3].subtitle) if_block5.p(ctx, dirty);
    			if (/*interests*/ ctx[3].description) if_block6.p(ctx, dirty);
    			if (/*interests*/ ctx[3].data) if_block7.p(ctx, dirty);
    			if (/*gallery*/ ctx[0].header) if_block8.p(ctx, dirty);
    			if (/*gallery*/ ctx[0].subtitle) if_block9.p(ctx, dirty);
    			if (/*gallery*/ ctx[0].description) if_block10.p(ctx, dirty);

    			if (dirty & /*gallery*/ 1) {
    				each_value = /*gallery*/ ctx[0].images;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div5, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			if (!div7_intro) {
    				add_render_callback(() => {
    					div7_intro = create_in_transition(div7, fade, { duration: 2000 });
    					div7_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			if (if_block10) if_block10.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('More', slots, []);
    	let lang = localStorage.getItem("LANG");
    	if (lang === "ES") lang = ES$1; else lang = EN$1;
    	let { gallery, header, hobbies, interests } = lang;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<More> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fade,
    		fly,
    		slide,
    		ImageCard,
    		ImageGroupCard,
    		EN: EN$1,
    		ES: ES$1,
    		lang,
    		gallery,
    		header,
    		hobbies,
    		interests
    	});

    	$$self.$inject_state = $$props => {
    		if ('lang' in $$props) lang = $$props.lang;
    		if ('gallery' in $$props) $$invalidate(0, gallery = $$props.gallery);
    		if ('header' in $$props) $$invalidate(1, header = $$props.header);
    		if ('hobbies' in $$props) $$invalidate(2, hobbies = $$props.hobbies);
    		if ('interests' in $$props) $$invalidate(3, interests = $$props.interests);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [gallery, header, hobbies, interests];
    }

    class More extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "More",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var info$1="info";var education$1="education";var experience$1="experience";var skills$1="skills";var demos$1="demos";var more$1="more";var footer$1={beta:"this page is on development, some information may change soon"};var EN = {info:info$1,education:education$1,experience:experience$1,skills:skills$1,demos:demos$1,more:more$1,footer:footer$1};

    var info="info";var education="Educación";var experience="Experiencia";var skills="habilidades";var demos="demos";var more="más";var footer={beta:"esta página está en desarrollo, alguna información puede cambiar"};var ES = {info:info,education:education,experience:experience,skills:skills,demos:demos,more:more,footer:footer};

    /* src\App.svelte generated by Svelte v3.44.1 */
    const file = "src\\App.svelte";

    // (50:4) <Link to={'/Portfolium' + "/"}>
    function create_default_slot_12(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*info*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(50:4) <Link to={'/Portfolium' + \\\"/\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (53:4) <Link to={'/Portfolium' + "/education"}>
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*education*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(53:4) <Link to={'/Portfolium' + \\\"/education\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (56:4) <Link to={'/Portfolium' + "/experience"}>
    function create_default_slot_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*experience*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(56:4) <Link to={'/Portfolium' + \\\"/experience\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (59:4) <Link to={'/Portfolium' + "/skill"}>
    function create_default_slot_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*skills*/ ctx[4]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(59:4) <Link to={'/Portfolium' + \\\"/skill\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (62:4) <Link to={'/Portfolium' + "/demos"}>
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*demos*/ ctx[6]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(62:4) <Link to={'/Portfolium' + \\\"/demos\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (65:4) <Link to={'/Portfolium' + "/more"}>
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*more*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(65:4) <Link to={'/Portfolium' + \\\"/more\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (71:2) <Route path={'/Portfolium' + "/"}>
    function create_default_slot_6(ctx) {
    	let info_1;
    	let current;
    	info_1 = new Info({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(info_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(info_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(info_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(info_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(71:2) <Route path={'/Portfolium' + \\\"/\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (74:2) <Route path={'/Portfolium' + "/education"}>
    function create_default_slot_5(ctx) {
    	let education_1;
    	let current;
    	education_1 = new Education({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(education_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(education_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(education_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(education_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(education_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(74:2) <Route path={'/Portfolium' + \\\"/education\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (77:2) <Route path={'/Portfolium' + "/experience"}>
    function create_default_slot_4(ctx) {
    	let experience_1;
    	let current;
    	experience_1 = new Experience({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(experience_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(experience_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(experience_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(experience_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(experience_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(77:2) <Route path={'/Portfolium' + \\\"/experience\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (80:2) <Route path={'/Portfolium' + "/skill"}>
    function create_default_slot_3(ctx) {
    	let skills_1;
    	let current;
    	skills_1 = new Skills({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(skills_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(skills_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skills_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skills_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(skills_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(80:2) <Route path={'/Portfolium' + \\\"/skill\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (83:2) <Route path={'/Portfolium' + "/demos"}>
    function create_default_slot_2(ctx) {
    	let demos_1;
    	let current;
    	demos_1 = new Demos({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(demos_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(demos_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(demos_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(demos_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(demos_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(83:2) <Route path={'/Portfolium' + \\\"/demos\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (86:2) <Route path={'/Portfolium' + "/more"}>
    function create_default_slot_1(ctx) {
    	let more_1;
    	let current;
    	more_1 = new More({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(more_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(more_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(more_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(more_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(more_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(86:2) <Route path={'/Portfolium' + \\\"/more\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (42:0) <Router>
    function create_default_slot(ctx) {
    	let nav;
    	let ul;
    	let li0;
    	let button;
    	let t0_value = (/*_lang*/ ctx[0] === "EN" ? "ES" : "EN") + "";
    	let t0;
    	let t1;
    	let li1;
    	let link0;
    	let t2;
    	let li2;
    	let link1;
    	let t3;
    	let li3;
    	let link2;
    	let t4;
    	let li4;
    	let link3;
    	let t5;
    	let li5;
    	let link4;
    	let t6;
    	let li6;
    	let link5;
    	let t7;
    	let main;
    	let route0;
    	let t8;
    	let route1;
    	let t9;
    	let route2;
    	let t10;
    	let route3;
    	let t11;
    	let route4;
    	let t12;
    	let route5;
    	let current;
    	let mounted;
    	let dispose;

    	link0 = new Link$1({
    			props: {
    				to: '/Portfolium' + "/",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: '/Portfolium' + "/education",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: '/Portfolium' + "/experience",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link$1({
    			props: {
    				to: '/Portfolium' + "/skill",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link$1({
    			props: {
    				to: '/Portfolium' + "/demos",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link5 = new Link$1({
    			props: {
    				to: '/Portfolium' + "/more",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route0 = new Route$1({
    			props: {
    				path: '/Portfolium' + "/",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: '/Portfolium' + "/education",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: '/Portfolium' + "/experience",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: {
    				path: '/Portfolium' + "/skill",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route$1({
    			props: {
    				path: '/Portfolium' + "/demos",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route5 = new Route$1({
    			props: {
    				path: '/Portfolium' + "/more",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			li1 = element("li");
    			create_component(link0.$$.fragment);
    			t2 = space();
    			li2 = element("li");
    			create_component(link1.$$.fragment);
    			t3 = space();
    			li3 = element("li");
    			create_component(link2.$$.fragment);
    			t4 = space();
    			li4 = element("li");
    			create_component(link3.$$.fragment);
    			t5 = space();
    			li5 = element("li");
    			create_component(link4.$$.fragment);
    			t6 = space();
    			li6 = element("li");
    			create_component(link5.$$.fragment);
    			t7 = space();
    			main = element("main");
    			create_component(route0.$$.fragment);
    			t8 = space();
    			create_component(route1.$$.fragment);
    			t9 = space();
    			create_component(route2.$$.fragment);
    			t10 = space();
    			create_component(route3.$$.fragment);
    			t11 = space();
    			create_component(route4.$$.fragment);
    			t12 = space();
    			create_component(route5.$$.fragment);
    			add_location(button, file, 45, 4, 1315);
    			attr_dev(li0, "class", "menu-item");
    			attr_dev(li0, "id", "menu-lang");
    			add_location(li0, file, 44, 3, 1272);
    			attr_dev(li1, "class", "menu-item");
    			attr_dev(li1, "id", "menu-info");
    			add_location(li1, file, 48, 3, 1401);
    			attr_dev(li2, "class", "menu-item");
    			attr_dev(li2, "id", "menu-education");
    			add_location(li2, file, 51, 3, 1503);
    			attr_dev(li3, "class", "menu-item");
    			attr_dev(li3, "id", "menu-experience");
    			add_location(li3, file, 54, 3, 1624);
    			attr_dev(li4, "class", "menu-item");
    			attr_dev(li4, "id", "menu-skill");
    			add_location(li4, file, 57, 3, 1748);
    			attr_dev(li5, "class", "menu-item");
    			attr_dev(li5, "id", "menu-demo");
    			add_location(li5, file, 60, 3, 1858);
    			attr_dev(li6, "class", "menu-item");
    			attr_dev(li6, "id", "menu-more");
    			add_location(li6, file, 63, 3, 1966);
    			attr_dev(ul, "id", "menu-list");
    			add_location(ul, file, 43, 2, 1248);
    			attr_dev(nav, "id", "menu-nav");
    			add_location(nav, file, 42, 1, 1225);
    			add_location(main, file, 69, 1, 2090);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, button);
    			append_dev(button, t0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			mount_component(link0, li1, null);
    			append_dev(ul, t2);
    			append_dev(ul, li2);
    			mount_component(link1, li2, null);
    			append_dev(ul, t3);
    			append_dev(ul, li3);
    			mount_component(link2, li3, null);
    			append_dev(ul, t4);
    			append_dev(ul, li4);
    			mount_component(link3, li4, null);
    			append_dev(ul, t5);
    			append_dev(ul, li5);
    			mount_component(link4, li5, null);
    			append_dev(ul, t6);
    			append_dev(ul, li6);
    			mount_component(link5, li6, null);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(route0, main, null);
    			append_dev(main, t8);
    			mount_component(route1, main, null);
    			append_dev(main, t9);
    			mount_component(route2, main, null);
    			append_dev(main, t10);
    			mount_component(route3, main, null);
    			append_dev(main, t11);
    			mount_component(route4, main, null);
    			append_dev(main, t12);
    			mount_component(route5, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", reload, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*_lang*/ 1) && t0_value !== (t0_value = (/*_lang*/ ctx[0] === "EN" ? "ES" : "EN") + "")) set_data_dev(t0, t0_value);
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    			const link5_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				link5_changes.$$scope = { dirty, ctx };
    			}

    			link5.$set(link5_changes);
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    			const route5_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				route5_changes.$$scope = { dirty, ctx };
    			}

    			route5.$set(route5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(link5.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(link5.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			destroy_component(link4);
    			destroy_component(link5);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(main);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    			destroy_component(route5);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(42:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let t0;
    	let footer_1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t1;
    	let h2;
    	let t3;
    	let div1;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    			t0 = space();
    			footer_1 = element("footer");
    			div0 = element("div");
    			img = element("img");
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "larapa99@gmail.com";
    			t3 = space();
    			div1 = element("div");
    			div1.textContent = `${/*footer*/ ctx[7].beta}`;
    			if (!src_url_equal(img.src, img_src_value = '/Portfolium' + "/images/glider_white.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "glider");
    			attr_dev(img, "class", "svelte-1cl3yrw");
    			add_location(img, file, 93, 2, 2592);
    			attr_dev(h2, "class", "svelte-1cl3yrw");
    			add_location(h2, file, 97, 2, 2676);
    			attr_dev(div0, "class", "raccoon-solutions svelte-1cl3yrw");
    			add_location(div0, file, 92, 1, 2557);
    			attr_dev(div1, "class", "beta svelte-1cl3yrw");
    			add_location(div1, file, 99, 1, 2715);
    			attr_dev(footer_1, "class", "svelte-1cl3yrw");
    			add_location(footer_1, file, 91, 0, 2546);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, footer_1, anchor);
    			append_dev(footer_1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t1);
    			append_dev(div0, h2);
    			append_dev(footer_1, t3);
    			append_dev(footer_1, div1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, _lang*/ 513) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(footer_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function reload() {
    	try {
    		let lang = localStorage.getItem("LANG");
    		if (!lang) throw "no-data";
    		if (lang === "EN") localStorage.setItem("LANG", "ES"); else localStorage.setItem("LANG", "EN");
    	} catch(error) {
    		localStorage.setItem("LANG", "EN");
    	}

    	window.location.replace('/Portfolium');
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let _lang = "EN";

    	onMount(() => {
    		try {
    			let lang = localStorage.getItem("LANG");
    			$$invalidate(0, _lang = lang);
    			if (!lang) throw "no-data";
    		} catch(error) {
    			localStorage.setItem("LANG", "EN");
    			$$invalidate(0, _lang = "EN");
    		}
    	});

    	let lang = localStorage.getItem("LANG");
    	if (lang === "ES") lang = ES; else lang = EN;
    	let { info, education, experience, skills, more, demos, footer } = lang;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router: Router$1,
    		Link: Link$1,
    		Route: Route$1,
    		Info,
    		Skills,
    		Education,
    		Experience,
    		Demos,
    		More,
    		onMount,
    		EN,
    		ES,
    		_lang,
    		lang,
    		info,
    		education,
    		experience,
    		skills,
    		more,
    		demos,
    		footer,
    		reload
    	});

    	$$self.$inject_state = $$props => {
    		if ('_lang' in $$props) $$invalidate(0, _lang = $$props._lang);
    		if ('lang' in $$props) lang = $$props.lang;
    		if ('info' in $$props) $$invalidate(1, info = $$props.info);
    		if ('education' in $$props) $$invalidate(2, education = $$props.education);
    		if ('experience' in $$props) $$invalidate(3, experience = $$props.experience);
    		if ('skills' in $$props) $$invalidate(4, skills = $$props.skills);
    		if ('more' in $$props) $$invalidate(5, more = $$props.more);
    		if ('demos' in $$props) $$invalidate(6, demos = $$props.demos);
    		if ('footer' in $$props) $$invalidate(7, footer = $$props.footer);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [_lang, info, education, experience, skills, more, demos, footer];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
