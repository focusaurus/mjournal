# # Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
# VAGRANTFILE_API_VERSION = "2"
#
# Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
#   # common settings shared by all vagrant boxes for this project
#   config.vm.box = "ubuntu/trusty64"
#   config.ssh.forward_agent = true
#   # stage box intended for configuration closely matching production
#   config.vm.define "mj-stage" do |stage|
#     config.vm.network :private_network, ip: "10.9.8.91"
#     stage.vm.synced_folder "./", "/vagrant", disabled: true
#   end
# end


# Optionally install this plugin for automatic /etc/hosts updating:
# vagrant plugin install vagrant-hostsupdater

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # common settings shared by all vagrant boxes for this project
  config.vm.box = "ubuntu/trusty64"
  config.vm.synced_folder "./", "/vagrant", disabled: true
  config.ssh.forward_agent = true
  {
    "mj-stage" => "10.9.8.90"
  }.each do |short_name, ip|
    config.vm.define short_name do |host|
      host.vm.network 'private_network', :ip => ip, :name => "vboxnet0", :adapter => 2
      host.vm.hostname = "#{short_name}.vagrant"
      if Vagrant.has_plugin?("vagrant-hostsupdater")
        config.hostsupdater.aliases = [host.vm.hostname.split(".").first]
      end
    end
  end
end
