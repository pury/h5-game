namespace pkoala {
    /**
     * 骨骼动画管理
     * @author pury
     * @date 2020-7-5
     * 
     * Copyright (c) 2020-present, pkoala.
     * All rights reserved.
     */
    export class DragonBonesManager {
        /**
         * 骨骼动画工厂
         */
        private _factory: dragonBones.EgretFactory;

        public constructor() {};

        /**
         * 获取骨骼动画实体
         * @param name 骨骼动画名称
         * @param path 资源路径，默认使用配置路径
         */
        public pop(name: string, path?: string): Promise<dragonBones.EgretArmatureDisplay>
        {
            return new Promise<dragonBones.EgretArmatureDisplay>((success, fail) => {
                this._factory = this._factory || dragonBones.EgretFactory.factory;

            });
        }

        /**
         * 回收骨骼动画实体
         * @param name 骨骼动画名称
         * @param entity 骨骼动画实体
         */
        public push(name: string, entity: dragonBones.EgretArmatureDisplay)
        {

        }

        /**
         * 销毁骨骼动画实体
         * @param entity 骨骼动画实体
         */
        public dispose(entity: dragonBones.EgretArmatureDisplay)
        {

        } 
    }
}