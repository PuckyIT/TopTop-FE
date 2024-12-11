// src/configs/ability.ts
import { AbilityBuilder, Ability, AbilityClass } from '@casl/ability';

export type Actions = 'read' | 'create' | 'update' | 'delete';
export type Subjects = 'Page' | 'Analytics' | 'Profile' | 'ShortVideo' | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

export default function defineAbilityFor(role: string): AppAbility {
  const { can, build } = new AbilityBuilder<Ability<[Actions, Subjects]>>(Ability as AbilityClass<AppAbility>);

  if (role === 'guest') {
    can('read', 'Page');
    can('read', 'ShortVideo');
  } else if (role === 'user') {
    can('read', 'Page');
    can('read', 'Profile');
    can('create', 'ShortVideo');
  }

  return build();
}