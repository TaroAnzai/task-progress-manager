
import type { ObjectiveReminderSetting } from '@/api/generated/taskProgressAPI.schemas';
import { Card, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableRow } from '@/components/ui/table';
interface RemainderSettingModalProps {
  reminderSettings: ObjectiveReminderSetting[];
}
export const ReminderTable = () => {
  return (
    <Card className='mr-4 p-4'>
      <CardTitle>設定一覧</CardTitle>
      <Table className='mt-4'>
        <TableHead>
          <TableRow>
            <TableHead>条件</TableHead>
            <TableHead>経過日数</TableHead>
            <TableHead>頻度</TableHead>
            <TableHead>間隔</TableHead>
            <TableHead>送信時刻</TableHead>
            <TableHead>有効</TableHead>
          </TableRow>

        </TableHead>
        <TableBody>

        </TableBody>
      </Table>
    </Card>
  )
}
