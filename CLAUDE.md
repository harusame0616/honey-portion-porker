# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# MCP

## Context7

- コード生成、セットアップや設定手順、ライブラリ/API ドキュメントが必要な場合は、常に Context7 を使用してください。
- Context7 MCP ツールを使用してライブラリ ID を解決し、ライブラリのドキュメントを自動的に取得してください。

## Serena

- 最小限の入出力でタスクを完了させられるようにツールを優先的に使用してください
- 最初に必ず `mcp__serena__list_memories` を使用して使えるメモリを把握してください
- タスクに関連するメモリを必ず参照してください
- タスク完了時にメモリの更新をしたほうがいい内容があった場合、変更を提案する
