import { useState } from "react"
import { toast } from "sonner"
import {
  usePostProgressOrganizations,
  useGetProgressOrganizations,
  useGetProgressOrganizationsOrgId,
} from "@/api/generated/taskProgressAPI"
import { useUser } from '@/context/UserContext';

export function useBulkOrganizationRegister() {
  const [loading, setLoading] = useState(false)
  const createOrg = usePostProgressOrganizations()
  const { user } = useUser()

  // ✅ Hookは必ずトップレベルで呼び出す
  if (user) {
    if (!user.is_superuser) {
    const { data: currentOrg } = useGetProgressOrganizationsOrgId(user.organization_id)
    if (currentOrg) {
    const { data: orgs } = useGetProgressOrganizations({ company_id: currentOrg.company_id })
  }}

  const registerFromLines = async (lines: string[]) => {
    setLoading(true)
    


    const nameToCode: Record<string, string> = {}
    const orgCodeToOrgId: Record<string, number> = {}
    const codeSet = new Set<string>()
    orgs?.forEach((org) => {
      if (org.name && org.org_code) {
        nameToCode[org.name] = org.org_code
        codeSet.add(org.org_code)
        orgCodeToOrgId[org.org_code] = org.id
      }
    })

    const errors: string[] = []
    let success = 0

    for (let i = 0; i < lines.length; i++) {
      const [name, orgCodeRaw, parentCodeRaw] = lines[i].split(",").map((s) => s.trim())

      if (!name || !orgCodeRaw) {
        errors.push(`行${i + 1}: 組織名とコードは必須です`)
        continue
      }

      if (!parentCodeRaw) {
        errors.push(`行${i + 1}: 親組織コードが空です`)
        continue
      }

      const org_code = nameToCode[orgCodeRaw] || orgCodeRaw
      const parent_code = nameToCode[parentCodeRaw] || parentCodeRaw

      if (orgCodeRaw && !codeSet.has(org_code) && nameToCode[orgCodeRaw] === undefined && orgCodeRaw !== org_code) {
        errors.push(`行${i + 1}: 組織コード「${orgCodeRaw}」が不正です`)
        continue
      }

      if (!codeSet.has(parent_code) && nameToCode[parentCodeRaw] === undefined && parentCodeRaw !== parent_code) {
        errors.push(`行${i + 1}: 親組織コード「${parentCodeRaw}」が不正です`)
        continue
      }

      try {
/*         await createOrg.mutateAsync({
          data: {
            name,
            org_code: org_code,
            parent_id: orgCodeToOrgId[parent_code],
          },
        }) */
       console.log("Creating organization:", {name, org_code, parent_code})
        success++
      } catch (err: any) {
        errors.push(`行${i + 1}: 「${name}」の登録に失敗：${err.message}`)
      }
    }

    if (success > 0) toast.success(`登録成功：${success} 件`)
    if (errors.length > 0) toast.error(`エラー：\n${errors.join("\n")}`)

    setLoading(false)
  }

  return { registerFromLines, loading }
}
