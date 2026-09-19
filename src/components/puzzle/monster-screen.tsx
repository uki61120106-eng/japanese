"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, Crown, FlaskConical, X } from "lucide-react"

import { MonsterCard } from "@/components/puzzle/monster-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requireMonsterSpec } from "@/lib/puzzle/monsters"
import {
  addExp,
  fusionExp,
  PARTY_SIZE,
  sortMonsters,
} from "@/lib/puzzle/party"
import {
  addToParty,
  fuseMonsters,
  removeFromParty,
  setLeader,
} from "@/lib/puzzle/save"
import type { OwnedMonster, SaveData } from "@/lib/puzzle/types"

type MonsterScreenProps = {
  save: SaveData
  onChange: (save: SaveData) => void
  onBack: () => void
}

export function MonsterScreen({ save, onChange, onBack }: MonsterScreenProps) {
  const [targetUid, setTargetUid] = useState<string | null>(null)
  // 強化するモンスターを選び直している最中かどうか。
  // 選んだあとも一覧を出したままだと、素材と取り違えやすい。
  const [pickingTarget, setPickingTarget] = useState(true)
  const [materialUids, setMaterialUids] = useState<string[]>([])
  const [notice, setNotice] = useState<string | null>(null)

  const byUid = useMemo(
    () => new Map(save.monsters.map((monster) => [monster.uid, monster])),
    [save.monsters]
  )
  const party = save.party
    .map((uid) => byUid.get(uid))
    .filter((monster): monster is OwnedMonster => Boolean(monster))
  const reserve = sortMonsters(
    save.monsters.filter((monster) => !save.party.includes(monster.uid))
  )

  const target = targetUid ? byUid.get(targetUid) : undefined
  const materials = materialUids
    .map((uid) => byUid.get(uid))
    .filter((monster): monster is OwnedMonster => Boolean(monster))

  /** 合成したらどうなるかの下見。実行前に必ず見せる。 */
  const preview = useMemo(() => {
    if (!target || materials.length === 0) return null
    const gained = materials.reduce(
      (sum, material) => sum + fusionExp(material, target),
      0
    )
    return { gained, after: addExp(target, gained).monster }
  }, [target, materials])

  function toggleMaterial(uid: string) {
    setNotice(null)
    setMaterialUids((current) =>
      current.includes(uid)
        ? current.filter((value) => value !== uid)
        : [...current, uid]
    )
  }

  function runFusion() {
    if (!target || materials.length === 0) return
    const before = target.level
    const result = fuseMonsters(save, target.uid, materialUids)
    const after = result.save.monsters.find(
      (monster) => monster.uid === target.uid
    )
    onChange(result.save)
    setMaterialUids([])
    setNotice(
      `${requireMonsterSpec(target.specId).name} に ${result.gainedExp.toLocaleString()} の経験値。` +
        (result.gainedLevels > 0
          ? ` Lv${before} → Lv${after?.level}`
          : " レベルは据え置き")
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 px-2">
          <ChevronLeft className="size-4" />
          もどる
        </Button>
        <span className="text-muted-foreground text-xs">
          {save.monsters.length} 体
        </span>
      </div>

      <Tabs defaultValue="party">
        <TabsList className="h-11 w-full rounded-xl p-1">
          <TabsTrigger value="party" className="rounded-lg">
            編成
          </TabsTrigger>
          <TabsTrigger value="fusion" className="rounded-lg">
            強化
          </TabsTrigger>
        </TabsList>

        {/* ── 編成 ── */}
        <TabsContent value="party" className="mt-4 flex flex-col gap-4">
          <section className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs tracking-widest">
              パーティ（{party.length} / {PARTY_SIZE}）
            </Label>
            {party.map((monster, index) => (
              <div key={monster.uid} className="flex items-stretch gap-1.5">
                <div className="min-w-0 flex-1">
                  <MonsterCard
                    monster={monster}
                    detailed
                    badge={
                      index === 0 ? (
                        <Crown className="size-4 shrink-0 text-amber-500" aria-label="リーダー" />
                      ) : undefined
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  {index !== 0 && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8 rounded-xl"
                      aria-label="リーダーにする"
                      onClick={() => onChange(setLeader(save, monster.uid))}
                    >
                      <Crown className="size-3.5" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-xl"
                    aria-label="パーティから外す"
                    disabled={party.length <= 1}
                    onClick={() => onChange(removeFromParty(save, monster.uid))}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </section>

          <section className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs tracking-widest">
              {party.length >= PARTY_SIZE
                ? "ひかえ（編成がいっぱいです。だれかを外すと加えられます）"
                : "ひかえ（タップで編成に加える）"}
            </Label>
            {reserve.length === 0 ? (
              <p className="text-muted-foreground text-xs">
                ひかえはいません。ダンジョンをクリアすると仲間が増えます。
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {reserve.map((monster) => (
                  <MonsterCard
                    key={monster.uid}
                    monster={monster}
                    detailed
                    disabled={party.length >= PARTY_SIZE}
                    onClick={() => onChange(addToParty(save, monster.uid))}
                  />
                ))}
              </div>
            )}
          </section>
        </TabsContent>

        {/* ── 強化 ── */}
        <TabsContent value="fusion" className="mt-4 flex flex-col gap-4">
          <section className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs tracking-widest">
              強化するモンスター
            </Label>
            {target && !pickingTarget ? (
              <div className="flex items-stretch gap-1.5">
                <div className="min-w-0 flex-1">
                  <MonsterCard monster={target} detailed selected />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-auto rounded-xl"
                  onClick={() => setPickingTarget(true)}
                >
                  変更
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {sortMonsters(save.monsters).map((monster) => {
                  // 最大Lv に達していると経験値を入れても意味がない
                  const maxed =
                    monster.level >= requireMonsterSpec(monster.specId).maxLevel
                  return (
                    <MonsterCard
                      key={monster.uid}
                      monster={monster}
                      detailed
                      selected={monster.uid === targetUid}
                      disabled={maxed || materialUids.includes(monster.uid)}
                      onClick={() => {
                        setTargetUid(monster.uid)
                        setPickingTarget(false)
                        setMaterialUids((current) =>
                          current.filter((uid) => uid !== monster.uid)
                        )
                        setNotice(null)
                      }}
                    />
                  )
                })}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs tracking-widest">
              素材（編成中のモンスターは選べません）
            </Label>
            {reserve.filter((monster) => monster.uid !== targetUid).length === 0 ? (
              <p className="text-muted-foreground text-xs">
                素材にできるモンスターがいません。
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {reserve
                  .filter((monster) => monster.uid !== targetUid)
                  .map((monster) => (
                    <MonsterCard
                      key={monster.uid}
                      monster={monster}
                      selected={materialUids.includes(monster.uid)}
                      badge={
                        target ? (
                          <span className="text-muted-foreground shrink-0 text-[0.65rem] tabular-nums">
                            +{fusionExp(monster, target).toLocaleString()}
                          </span>
                        ) : undefined
                      }
                      onClick={() => toggleMaterial(monster.uid)}
                    />
                  ))}
              </div>
            )}
          </section>

          <div className="bg-card sticky bottom-3 flex flex-col gap-2 rounded-2xl border-2 p-3 shadow-lg">
            {notice && <p className="text-xs text-emerald-600 dark:text-emerald-400">{notice}</p>}
            {target ? (
              <p className="text-xs">
                {requireMonsterSpec(target.specId).name}（Lv{target.level}）に
                {preview ? (
                  <>
                    {" "}
                    <span className="font-bold tabular-nums">
                      {preview.gained.toLocaleString()}
                    </span>{" "}
                    の経験値 → <span className="font-bold">Lv{preview.after.level}</span>
                  </>
                ) : (
                  " 素材を選んでください"
                )}
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">
                強化するモンスターを選んでください
              </p>
            )}
            <Button
              className="h-11 w-full rounded-xl"
              disabled={!target || materials.length === 0}
              onClick={runFusion}
            >
              <FlaskConical className="size-4" />
              {materials.length} 体を合成する
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
