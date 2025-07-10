// 仮：context や localStorage などから取得
export function getCurrentUserId(): number {
  const id = Number(localStorage.getItem('progress_user_id'));
  if (!id) throw new Error('ログインユーザーIDが取得できません');
  return id;
}

export function getDisplayUserId(): number {
  const id = Number(localStorage.getItem('display_user_id')) || getCurrentUserId();
  return id;
}
