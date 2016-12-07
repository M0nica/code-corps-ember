import Ember from 'ember';

const {
  get,
  inject: { service },
  isEmpty,
  RSVP,
  Service,
  set
} = Ember;

export default Service.extend({
  metrics: service(),
  session: service(),
  store: service(),

  loadCurrentUser() {
    return new RSVP.Promise((resolve, reject) => {
      let userId = get(this, 'session.session.authenticated.user_id');
      if (!isEmpty(userId)) {
        return get(this, 'store').findRecord('user', userId).then((user) => {
          set(this, 'user', user);
          this._identifyUser(user);
          resolve(user);
        }, reject);
      } else {
        resolve(null);
      }
    });
  },

  _identifyUser(user) {
    // Segment
    get(this, 'metrics').identify({
      distinctId: get(user, 'id'),
      biography: get(user, 'biography'),
      insertedAt: get(user, 'insertedAt'),
      email: get(user, 'email'),
      name: get(user, 'name'),
      state: get(user, 'state'),
      username: get(user, 'username'),
      website: get(user, 'website')
    });
  }
});
