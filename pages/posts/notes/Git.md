---
title: Git 常用命令
date: 2022-08-16 15:30
category: Notes
comment: hidden
---

[[toc]]

# 创建分支

```bash
git branch -a//看所有分支
git branch branchName//在本地新建一个分支
git checkout -b branchName //新创建分支并切换
git checkout branchName//切换到你的新分支
git push origin branchName//将新分支发布在github上
git branch -d branchName//在本地删除一个分支
git push origin :branchName//github远程端删除一个分支,分支名前的冒号代表删除
```

# git更新本地远程分支列表

使用情况：`git branch -a` 不出现远程新的分支或者远程已经没有的分支在本地还有。

```bash
git remote update origin --prune //更新本地的git分支保持和远程分支一致
git fetch origin //同步远程服务器上的数据到本地
```

# 将本地仓库推送到空的远程仓库

```bash
git remote add origin https://github.com/... 
git add . // git add * 添加文件会把忽略的文件也添加进去
git commit -m 'first commit'
git push origin master
```

# commit不忽略空文件夹
如，现在在本地仓库中存在空文件夹 data，且 `git push` 的时候不想忽略他。

1. 在 data 文件夹下打开 `git bash` 输入 `touch .gitkeep` 创建 `.gitkeep` 文件
    - `.gitkeep` 文件能够保证空文件夹能够保留
    - `.gitkeep` 文件内容可以写上备注（不写也可）

```bash
# Ignore everything in this directory
*
# Except this file !.gitkeep
```

2. 在 `.gitignore` 中添加

```bash
data/*
!data/.gitkeep
```



```bash
```

# 添加文件提交到远程仓库的一般流程：

```bash
git add (file name)
git commit -m "对本次修改的描述" //如果不commit 后面无法push
git remote add test https://github.com/xutinting/test.git //修改远程仓库名，便于后面使用
git push test main //将本地分支push到远程的main分支上，似乎本地分支名要和远程分支名一样才能推送？
git pull test main //修改后的main分支pull到本地仓库
git switch -c dev //在本地创建并切换到新的dev分支
git push test dev //在本地修改dev分支后，向远程推送dev分支，此后远程仓库会出现和本地仓库同名的dev分支
```

仓库连接使用 `https` 或者 `ssh` 步骤类似，`ssh` 在 `push` 和 `pull` 时会提示输入我的 `ssh` 密码。

对于一个新的本地仓库来说，若要推送到远程仓库，须先对本地仓库进行 `init` 、`add`、`commit`等操作。我先 `remote add` 添加远程分支后再上传文件，会显示远程对应分支不存在。

<font color="red" face="宋体">注意：子文件夹里不能存在 `.git` 目录！</font>

# merge分支

比如我在新建的dev分支做了修改，现在需要合并到其他分支，如master分支。

```bash
git checkout dev //如果当前就在dev分支则不需要
git pull //拉取当前分支最新代码
git checkout master //切换到需要合并的分支
git merge dev //将master分支和dev合并
git push //推送到远程仓库
```

# 删除分支

删除远程分支：
默认分支不能删除，其他分支若要删除，则（以dev为例）：

```bash
git branch -r //查看远程分支
git push --delete origin dev
git branch -a //查看所有分支
git branch -m dev main //修改本地分支dev为main
git push origin main //推送改过名字的本地分支
```

# 文件、文件夹的删除

git删除远程分支包括两种情况：
1. 仅仅删除远程分支文件，不删除本地的文件；
删除远程文件 filename：

```bash
git rm --cached filename
git commit -m "delete remote file filename "
git push -u origin master(此处是当前分支的名字)
```

删除远程文件夹 directoryname：

```bash
git rm -r --cached directoryname
git commit -m "delete remote directory directoryname "
git push -u origin master(此处是当前分支的名字)
```

2. 删除远程分支文件的同时，删除本地的文件。
删除文件 filename：

```bash
git rm filename
git commit -m "delete file filename "
git push -u origin master(此处是当前分支的名字)
```

删除文件夹directoryname：

```bash
git rm -r directoryname
git commit -m "delete directory directoryname "
git push -u origin master(此处是当前分支的名字)
```

# 删除本地文件/文件夹并推送到远程分支

```bash
//文件
git rm 文件名
git commit -m "delete ..."
...

//文件夹
git rm -r --cached 文件夹名
git commit -m "remove ..."
...
```

# 删除某次commit记录（回滚代码）

```bash
git log //查看需要回滚的版本号
git reset --hard <需要回退到的版本号（只需要输入前几位）>
git push origin <分支名> --force
```

# 强制将远程分支覆盖本地分支

```bash
//多条命令，推荐
git fetch --all
git reset --hard origin/master //将远程分支master覆盖本地
git pull

//单条，仅了解
git fetch --all &&  git reset --hard origin/master && git pull
```

# 本地分支覆盖远程分支

```bash
git init //要先初始化本地仓库
git push origin master --force  //覆盖远程分支origin master
```

# 本地仓库查看 log 日志不显示最新状态

```bash
git remote update //本地仓库更新，拿到远端的所有元数据
git log origin/branch 
```

# 对比查看2个分支的差异

## 显示分支中差异部分

```bash
git diff branch1 branch2 --stat		
```

## 显示指定文件详细差异

```bash
git diff branch1 branch2 具体文件路径
```

## 显示出所有有差异的文件的详细差异

```bash
git diff branch1 branch2
```

## 查看branch1分支有，而branch2中没有的log

```bash
git log branch1 ^branch2
```

## 查看branch2中比branch1中多提交了哪些内容

```bash
git log branch1..branch2
```

## 不知道谁提交的多谁提交的少，单纯想知道有什么不一样

```bash
git log branch1...branch2
```

# .gitignore

忽略某些上传的文件或文件夹，创建 `.gitignore` 文件：

```bash
touch .gitignore
```

忽略规则：

```bash
target          //忽略这个target目录
angular.json    //忽略这个angular.json文件
log/*           //忽略log下的所有文件
css/*.css       //忽略css目录下的.css文件
```

# 其他

## ssh失效或者忘记ssh密码

重新生成密匙：`ssh-keygen -t rsa -C "your_email@example.com"`

参考[Github配置ssh key的步骤](https://blog.csdn.net/weixin_42310154/article/details/118340458)。

## ERROR:ssh connect to host github.com port 22

似乎是没有成功认证用户，参考[文章](https://jueee.github.io/2020/10/2020-10-19-github%E8%BF%9E%E6%8E%A5%E6%8A%A5ssh%20connect%20to%20host%20github.com%20port%2022%20Connection%20timed%20out%E9%94%99%E8%AF%AF/)解决。在存放公钥私钥的同级文件夹中，新建 `config` 文本，内容为：

```txt
Host github.com
User git邮箱地址
Hostname ssh.github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa
Port 443
```
