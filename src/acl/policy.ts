// レベルは3段階：view / edit / full
export type AccessLevel = 'VIEW' | 'EDIT' | 'FULL';

// 操作の粒度は表に合わせる（task/objective/progress）
export type Action =
  | 'task.view'
  | 'task.create'
  | 'task.update'
  | 'task.delete'
  | 'objective.view'
  | 'objective.create'
  | 'objective.update'
  | 'objective.delete'
  | 'progress.view'
  | 'progress.create'
  | 'progress.update'
  | 'progress.delete';

// 対象（Subject）。進捗の担当者例外を判断するため、objective に assigned を載せる
export type TaskSubject = { kind: 'task'; taskId: number };
export type ObjectiveSubject = {
  kind: 'objective';
  taskId: number;
  objectiveId: number;
  /** 現在ユーザーがこのオブジェクトの担当か？（UI側で算出して渡す） */
  assigned?: boolean;
};
export type Subject = TaskSubject | ObjectiveSubject;

const levelRank: Record<AccessLevel, number> = {
  VIEW: 1,
  EDIT: 2,
  FULL: 3,
};

// 表の ○/× を最小レベルに落とし込む
const requiredLevel: Record<Action, AccessLevel> = {
  // タスク
  'task.view': 'VIEW',
  'task.create': 'FULL',   // ※グローバル権限で管理したい場合は別途
  'task.update': 'FULL',
  'task.delete': 'FULL',

  // オブジェクティブ
  'objective.view': 'VIEW',
  'objective.create': 'EDIT',
  'objective.update': 'EDIT',
  'objective.delete': 'EDIT',

  // 進捗
  'progress.view': 'VIEW',
  'progress.create': 'EDIT',  // ← 担当者例外あり（下の isAllowed で上書き）
  'progress.update': 'EDIT',  // ← 同上
  'progress.delete': 'FULL',
};

const baseAllowed = (level: AccessLevel | undefined, action: Action): boolean => {
  if (!level) return false;
  return levelRank[level] >= levelRank[requiredLevel[action]];
}

/**
 * 例外ルール：
 * - 閲覧権限（VIEW）でも「オブジェクティブの担当者」であれば
 *   progress.create / progress.update を許可
 */
export const isAllowed = (
  level: AccessLevel | undefined,
  action: Action,
  subject: Subject
): boolean => {
  // まず通常判定
  const ok = baseAllowed(level, action);
  if (ok) return true;

  // VIEWでも担当なら進捗の追加・編集を許可
  if (
    (action === 'progress.create' || action === 'progress.update') &&
    subject.kind === 'objective' &&
    subject.assigned === true &&
    level === 'VIEW'
  ) {
    return true;
  }

  return false;
}
