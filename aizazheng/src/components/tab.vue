<template>
	<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
	  <el-tab-pane label="全部" name="0"></el-tab-pane>
	  <el-tab-pane label="颜值" name="1"></el-tab-pane>
	  <el-tab-pane label="皮肤" name="2"></el-tab-pane>
	  <el-tab-pane label="明星" name="3"></el-tab-pane>
	  <el-tab-pane label="到店" name="4"></el-tab-pane>
	</el-tabs>
</template>